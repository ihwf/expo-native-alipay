//
//  ExpoAlipayDelegate.swift
//  ExpoNativeAlipay
//
//  Created by heweifeng on 7/15/25.
//

import ExpoModulesCore
import AlipaySDK

public class ExpoAlipayDelegate: ExpoAppDelegateSubscriber {
    // 适配 iOS 9 及以上
    public func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        if url.host == "safepay" {
            // 支付跳转支付宝钱包进行支付，处理支付结果
            AlipaySDK.defaultService()?.processOrder(withPaymentResult: url, standbyCallback: { resultDic in
                self.sendAlipayResult(resultDic)
            })

            // 授权跳转支付宝钱包进行支付，处理支付结果
            AlipaySDK.defaultService()?.processAuth_V2Result(url, standbyCallback: { resultDic in
                self.sendAlipayResult(resultDic)
            })
            return true
        }
        return false
    }

    // 兼容 iOS 8 及以下（如需支持）
    public func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
        if url.host == "safepay" {
            // 支付跳转支付宝钱包进行支付，处理支付结果
            AlipaySDK.defaultService()?.processOrder(withPaymentResult: url, standbyCallback: { resultDic in
                self.sendAlipayResult(resultDic)
            })
            
            // 授权跳转支付宝钱包进行支付，处理支付结果
            AlipaySDK.defaultService()?.processAuth_V2Result(url, standbyCallback: { resultDic in
                self.sendAlipayResult(resultDic)
            })
            return true
        }
        return false
    }

    // 处理 Universal Link 回调
    public func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb {
            AlipaySDK.defaultService()?.handleOpenUniversalLink(userActivity, standbyCallback: { resultDic in
                self.sendAlipayResult(resultDic)
            })
        }
        return true
    }

    private func sendAlipayResult(_ resultDic: [AnyHashable: Any]?) {
        // 通过 moduleRegistry 获取 ExpoNativeAlipayModule 实例
        if let module = AppContext?.moduleRegistry?.getModuleImplementingProtocol(ExpoNativeAlipayModule.self) as? ExpoNativeAlipayModule {
            // 判断是支付还是授权，根据 resultDic 内容区分
            if let result = resultDic?["result"] as? String, result.contains("auth_code=") {
                module.handleAlipayAuthResult(resultDic ?? [:])
            } else {
                module.handleAlipayResult(resultDic ?? [:])
            }
        }
    }
}