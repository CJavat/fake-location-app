package expo.modules.mocklocation

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.location.Criteria
import android.location.LocationManager
import androidx.core.content.ContextCompat
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private class MockLocationNotSupportedException : CodedException(
  code = "ERR_MOCK_LOCATION_APP_NOT_SELECTED",
  message = "Habilita esta app como \"app de ubicación de prueba\" en Opciones de desarrollador para poder simular tu ubicación.",
  cause = null,
)

class MockLocationModule : Module() {
  private val stoppedReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
      sendEvent("onMockLocationStopped")
    }
  }

  override fun definition() = ModuleDefinition {
    Name("MockLocation")

    Events("onMockLocationStopped")

    OnCreate {
      val context = appContext.reactContext ?: return@OnCreate
      val filter = IntentFilter(MockLocationForegroundService.ACTION_STOPPED)
      ContextCompat.registerReceiver(context, stoppedReceiver, filter, ContextCompat.RECEIVER_NOT_EXPORTED)
    }

    OnDestroy {
      appContext.reactContext?.unregisterReceiver(stoppedReceiver)
    }

    Function("startService") { latitude: Double, longitude: Double ->
      val context = appContext.reactContext ?: return@Function
      val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager

      try {
        enableTestProvider(locationManager, LocationManager.GPS_PROVIDER)
        enableTestProvider(locationManager, LocationManager.NETWORK_PROVIDER)
      } catch (error: SecurityException) {
        throw MockLocationNotSupportedException()
      }

      val intent = Intent(context, MockLocationForegroundService::class.java).apply {
        action = MockLocationForegroundService.ACTION_START
        putExtra(MockLocationForegroundService.EXTRA_LAT, latitude)
        putExtra(MockLocationForegroundService.EXTRA_LON, longitude)
      }
      ContextCompat.startForegroundService(context, intent)
    }

    Function("stopService") {
      appContext.reactContext?.let { context ->
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager

        disableTestProviderQuietly(locationManager, LocationManager.GPS_PROVIDER)
        disableTestProviderQuietly(locationManager, LocationManager.NETWORK_PROVIDER)

        val intent = Intent(context, MockLocationForegroundService::class.java).apply {
          action = MockLocationForegroundService.ACTION_STOP
        }
        ContextCompat.startForegroundService(context, intent)
      }
    }
  }

  private fun enableTestProvider(locationManager: LocationManager, provider: String) {
    try {
      locationManager.addTestProvider(
        provider,
        false, false, false, false,
        true, true, true,
        Criteria.POWER_LOW, Criteria.ACCURACY_FINE,
      )
    } catch (error: IllegalArgumentException) {
      // Ya estaba registrado como test provider por una llamada anterior a startService.
    }
    locationManager.setTestProviderEnabled(provider, true)
  }

  private fun disableTestProviderQuietly(locationManager: LocationManager, provider: String) {
    try {
      locationManager.removeTestProvider(provider)
    } catch (error: IllegalArgumentException) {
      // El proveedor nunca llegó a registrarse, no hay nada que limpiar.
    } catch (error: SecurityException) {
      // Idem, pero por permisos revocados en tiempo de ejecución.
    }
  }
}
