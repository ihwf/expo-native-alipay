import ExpoModulesCore
import AlipaySDK

public class ExpoNativeAlipayModule: Module {
  private var alipayScheme: String?
  private var payPromise: Promise?
  private var authPromise: Promise?
  private var isPayResolved = false
  private var isAuthResolved = false

  public func definition() -> ModuleDefinition {
    Name("ExpoNativeAlipay")
    /**
    * 注册接口
    *
    * @param appId 商户appId
    * @param universalLink       商户app关联的universalLink与开放平台配置一直
    */
    AsyncFunction("registerApp") { (appId: String, universalLink: String?) in
      if let universalLink = universalLink {
        AlipaySDK.defaultService()?.registerApp(appId, universalLink: universalLink)
      } else {
        AlipaySDK.defaultService()?.registerApp(appId)
      }
    }

    AsyncFunction("pay") { (orderString: String, promise: Promise) in
      self.payPromise = promise
      self.isPayResolved = false
      AlipaySDK.defaultService()?.payOrder(orderString, fromScheme: self.alipayScheme) { resultDic in
        self.handleAlipayResult(resultDic ?? [:])
      }
    }

    AsyncFunction("authInfo") { (infoStr: String, promise: Promise) in
      self.authPromise = promise
      self.isAuthResolved = false
      AlipaySDK.defaultService()?.auth_V2(withInfo: infoStr, fromScheme: self.alipayScheme, callback: { resultDic in
        self.handleAlipayAuthResult(resultDic ?? [:])
      })
    }

    AsyncFunction("setAlipayScheme") { (scheme: String) in
      self.alipayScheme = scheme
    }

    AsyncFunction("getVersion") { (promise: Promise) in
      let version = AlipaySDK.defaultService()?.currentVersion ?? ""
      promise.resolve(version)
    }
  }

  // 处理支付结果
  public func handleAlipayResult(_ resultDic: [AnyHashable: Any]) {
    if !self.isPayResolved {
      self.payPromise?.resolve(resultDic)
      self.isPayResolved = true
      self.payPromise = nil
    }
  }

  // 处理授权结果
  public func handleAlipayAuthResult(_ resultDic: [AnyHashable: Any]) {
    if !self.isAuthResolved {
      self.authPromise?.resolve(resultDic)
      self.isAuthResolved = true
      self.authPromise = nil
    }
  }
}
