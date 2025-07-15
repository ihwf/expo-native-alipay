// Reexport the native module. On web, it will be resolved to ExpoNativeAlipayModule.web.ts
// and on native platforms to ExpoNativeAlipayModule.ts
export * from './ExpoNativeAlipay.types';
export { authInfo, default, getVersion, alipay, setAlipaySandbox, setAlipayScheme } from './ExpoNativeAlipayModule';
