/** @type {import('expo/config-plugins').AndroidConfig} */
const { AndroidConfig, withAndroidManifest } = require('expo/config-plugins')

const { getMainApplicationOrThrow } = AndroidConfig.Manifest

const withNativeAlipayConfig = (config) => {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults

        // 检查是否已经存在 queries 标签
        if (!config.modResults.manifest.queries) {
            config.modResults.manifest.queries = []
        }

        // 检查是否已经添加了微信包查询，避免重复添加
        const existingAlipayQuery = config.modResults.manifest.queries.find(
            (query) =>
                query.package &&
                query.package.some(
                    (pkg) =>
                        pkg.$ &&
                        pkg.$['android:name'] === 'com.eg.android.AlipayGphone'
                )
        )

        if (!existingAlipayQuery) {
            config.modResults.manifest.queries.push({
                package: [
                    {
                        $: {
                            'android:name': 'com.eg.android.AlipayGphone'
                        }
                    }
                ]
            })
        }

        const mainApplication = getMainApplicationOrThrow(androidManifest)

        // 确保 activity 数组存在
        if (!mainApplication.activity) {
            mainApplication.activity = []
        }

        // 检查是否已经添加了 H5PayActivity，避免重复添加
        const existingH5PayActivity = mainApplication.activity.find(
            (activity) =>
                activity.$ &&
                activity.$['android:name'] ===
                    'com.alipay.sdk.app.H5PayActivity'
        )

        if (!existingH5PayActivity) {
            mainApplication.activity.push({
                $: {
                    'android:name': 'com.alipay.sdk.app.H5PayActivity',
                    'android:configChanges':
                        'orientation|keyboardHidden|navigation|screenSize',
                    'android:exported': 'false',
                    'android:screenOrientation': 'behind',
                    'android:windowSoftInputMode': 'adjustResize|stateHidden',
                    'tools:replace': 'android:configChanges'
                }
            })
        }

        // 检查是否已经添加了 H5AuthActivity，避免重复添加
        const existingH5AuthActivity = mainApplication.activity.find(
            (activity) =>
                activity.$ &&
                activity.$['android:name'] ===
                    'com.alipay.sdk.app.H5AuthActivity'
        )

        if (!existingH5AuthActivity) {
            mainApplication.activity.push({
                $: {
                    'android:name': 'com.alipay.sdk.app.H5AuthActivity',
                    'android:configChanges':
                        'orientation|keyboardHidden|navigation',
                    'android:exported': 'false',
                    'android:screenOrientation': 'behind',
                    'android:windowSoftInputMode': 'adjustResize|stateHidden',
                    'tools:replace': 'android:configChanges'
                }
            })
        }

        return config
    })
}

const withConfig = (config) => {
    config = withNativeAlipayConfig(config)

    return config
}

module.exports = withConfig
