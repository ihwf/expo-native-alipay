/*
 * @Author: heweifeng
 * @Date: 2025-07-14 14:55:09
 * @LastEditors: heweifeng
 * @LastEditTime: 2025-07-15 16:50:40
 * @Description:
 */
import { requireNativeModule } from 'expo'
import { Platform } from 'react-native'

import { AuthResult, OrderResult } from './ExpoNativeAlipay.types'

const LINKING_ERROR =
    `The package 'expo-native-alipay' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({
        ios: "\u2022 You have run 'pod install'\n",
        default: ''
    }) +
    '\u2022 You rebuilt the app after installing the package\n' +
    '\u2022 You are not using Expo Go\n'

const ExpoNativeAlipay = requireNativeModule('ExpoNativeAlipay')
    ? requireNativeModule('ExpoNativeAlipay')
    : new Proxy(
          {},
          {
              get() {
                  throw new Error(LINKING_ERROR)
              }
          }
      )

/**
 * 支付
 * @param orderString 支付参数
 * @returns result 支付宝回调结果 https://docs.open.alipay.com/204/105301
 */
export function alipay(orderString: string): Promise<OrderResult> {
    return ExpoNativeAlipay.pay(orderString)
}

/**
 * 登录授权
 * @param infoStr 授权参数
 * - ⚠️ 注意授权成功返回结果是一个字符串，[返回内容](https://github.com/uiwjs/react-native-alipay/blob/74140a294e850884ed1851b9d2c2d2c00ee75003/index.d.ts#L89-L113)
 * - ⚠️ 支付宝需要设置 Scheme 和 iOS添加原生代码，才能支持验证[回弹商家APP]的功能
 * - ⚠️ 支付宝 `管理中心-支付宝开放平台` 需要签约 `APP支付宝登录`
 * @param authInfoStr 验证详情
 * @returns result 支付宝回调结果 https://opendocs.alipay.com/open/218/105327
 */
export function authInfo(infoStr: string): Promise<AuthResult> {
    return ExpoNativeAlipay.authInfo(infoStr)
}

/**
 * 获取 SDK 版本
 *  @return 当前版本字符串
 */
export function getVersion(): Promise<string> {
    return ExpoNativeAlipay.getVersion()
}

/**
 * 设置支付宝跳转Scheme，仅 iOS
 * @param scheme
 * @platform ios
 */
export function setAlipayScheme(scheme: string): void {
    if (Platform.OS === 'ios') {
        ExpoNativeAlipay.setAlipayScheme(scheme)
    }
}

/**
 * 设置支付宝沙箱环境，仅 Android
 * @platform android
 */
export function setAlipaySandbox(isSandbox: boolean): void {
    if (Platform.OS === 'android') {
        ExpoNativeAlipay.setAlipaySandbox(isSandbox)
    }
}

// This call loads the native module object from the JSI.
export default ExpoNativeAlipay
