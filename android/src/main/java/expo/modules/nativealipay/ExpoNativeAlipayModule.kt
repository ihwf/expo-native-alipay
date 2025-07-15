package expo.modules.nativealipay

import android.app.Activity
import com.alipay.sdk.app.AuthTask
import com.alipay.sdk.app.PayTask
import com.alipay.sdk.app.EnvUtils
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

class ExpoNativeAlipayModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoNativeAlipay")

        AsyncFunction("pay") { orderString: String, promise: Promise ->
            val activity = appContext.currentActivity
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "No current activity", null)
                return@AsyncFunction
            }
            Thread {
                val alipay = PayTask(activity)
                val result = alipay.payV2(orderString, true)
                promise.resolve(result)
            }.start()
        }

        AsyncFunction("authInfo") { infoStr: String, promise: Promise ->
            val activity = appContext.currentActivity
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "No current activity", null)
                return@AsyncFunction
            }
            Thread {
                val authTask = AuthTask(activity)
                val result = authTask.authV2(infoStr, true)
                promise.resolve(result)
            }.start()
        }

        AsyncFunction("setAlipaySandbox") { isSandbox: Boolean, promise: Promise ->
            if (isSandbox) {
                EnvUtils.setEnv(EnvUtils.EnvEnum.SANDBOX)
            } else {
                EnvUtils.setEnv(EnvUtils.EnvEnum.ONLINE)
            }
            promise.resolve(isSandbox)
        }

        AsyncFunction("getVersion") { promise: Promise ->
            val activity = appContext.currentActivity
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "No current activity", null)
                return@AsyncFunction
            }
            val payTask = PayTask(activity)
            promise.resolve(payTask.getVersion())
        }
    }
} 