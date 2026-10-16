package com.universal

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.splashview.SplashView

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "Universal"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    // Hold the dark system splash until our branded SplashView dialog is up.
    val splashScreen = installSplashScreen()
    var keepSplash = true
    splashScreen.setKeepOnScreenCondition { keepSplash }

    SplashView.showSplashView(this)
    keepSplash = false

    rewriteShareIntent(intent)
    super.onCreate(savedInstanceState)
  }

  override fun onNewIntent(intent: Intent) {
    rewriteShareIntent(intent)
    setIntent(intent)
    super.onNewIntent(intent)
  }

  /**
   * Android share sheet (ACTION_SEND text/plain) → universal://add?initialUrl=…
   * so React Navigation linking can open Add Download.
   */
  private fun rewriteShareIntent(intent: Intent?) {
    if (intent == null) return
    if (intent.action != Intent.ACTION_SEND) return
    val type = intent.type ?: return
    if (!type.startsWith("text/")) return

    val shared = intent.getStringExtra(Intent.EXTRA_TEXT)?.trim().orEmpty()
    if (shared.isEmpty()) return

    val deepLink =
        Uri.parse("universal://add").buildUpon()
            .appendQueryParameter("initialUrl", shared)
            .build()

    intent.action = Intent.ACTION_VIEW
    intent.data = deepLink
    intent.type = null
  }
}
