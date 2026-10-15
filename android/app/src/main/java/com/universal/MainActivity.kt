package com.universal

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

    super.onCreate(savedInstanceState)
  }
}
