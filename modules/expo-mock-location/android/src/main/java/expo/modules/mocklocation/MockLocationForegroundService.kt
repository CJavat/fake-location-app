package expo.modules.mocklocation

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.location.Location
import android.location.LocationManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.os.SystemClock
import androidx.core.app.NotificationCompat

class MockLocationForegroundService : Service() {

  private val handler = Handler(Looper.getMainLooper())
  private var latitude = 0.0
  private var longitude = 0.0
  private var wakeLock: PowerManager.WakeLock? = null

  private lateinit var locationManager: LocationManager

  private val pushLocationRunnable = object : Runnable {
    override fun run() {
      pushMockLocation()
      handler.postDelayed(this, UPDATE_INTERVAL_MS)
    }
  }

  override fun onCreate() {
    super.onCreate()
    locationManager = getSystemService(LOCATION_SERVICE) as LocationManager
  }

  override fun onBind(intent: Intent?) = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_STOP -> {
        stopMocking()
        return START_NOT_STICKY
      }
      else -> {
        latitude = intent?.getDoubleExtra(EXTRA_LAT, latitude) ?: latitude
        longitude = intent?.getDoubleExtra(EXTRA_LON, longitude) ?: longitude
        startMocking()
      }
    }
    return START_STICKY
  }

  override fun onDestroy() {
    handler.removeCallbacks(pushLocationRunnable)
    releaseWakeLock()
    super.onDestroy()
  }

  private fun startMocking() {
    showForegroundNotification()
    acquireWakeLock()
    handler.removeCallbacks(pushLocationRunnable)
    handler.post(pushLocationRunnable)
  }

  private fun stopMocking() {
    handler.removeCallbacks(pushLocationRunnable)
    releaseWakeLock()
    stopForeground(STOP_FOREGROUND_REMOVE)
    stopSelf()
    sendBroadcast(Intent(ACTION_STOPPED).setPackage(packageName))
  }

  private fun acquireWakeLock() {
    if (wakeLock?.isHeld == true) return

    val powerManager = getSystemService(POWER_SERVICE) as PowerManager
    wakeLock = powerManager.newWakeLock(
      PowerManager.PARTIAL_WAKE_LOCK,
      "MockLocation:ForegroundServiceWakeLock",
    ).apply {
      setReferenceCounted(false)
      acquire()
    }
  }

  private fun releaseWakeLock() {
    wakeLock?.let { if (it.isHeld) it.release() }
    wakeLock = null
  }

  private fun pushMockLocation() {
    val fakeLocation = { provider: String ->
      Location(provider).apply {
        latitude = this@MockLocationForegroundService.latitude
        longitude = this@MockLocationForegroundService.longitude
        altitude = 0.0
        accuracy = 1f
        bearing = 0f
        speed = 0f
        time = System.currentTimeMillis()
        elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos()
      }
    }

    try {
      locationManager.setTestProviderLocation(LocationManager.GPS_PROVIDER, fakeLocation(LocationManager.GPS_PROVIDER))
      locationManager.setTestProviderLocation(LocationManager.NETWORK_PROVIDER, fakeLocation(LocationManager.NETWORK_PROVIDER))
    } catch (error: SecurityException) {
      // El sistema revocó el estado de "app de ubicación de prueba" en pleno uso.
      stopMocking()
    } catch (error: IllegalArgumentException) {
      // El proveedor de prueba no está registrado (el Module no llegó a habilitarlo).
      stopMocking()
    }
  }

  private fun showForegroundNotification() {
    createNotificationChannelIfNeeded()

    val stopIntent = Intent(this, MockLocationForegroundService::class.java).apply {
      action = ACTION_STOP
    }
    val stopPendingIntent = PendingIntent.getService(
      this,
      0,
      stopIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("Ubicación simulada activa")
      .setContentText("Tu ubicación se está enviando falsificada. Toca para detener.")
      .setSmallIcon(android.R.drawable.ic_menu_mylocation)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Detener", stopPendingIntent)
      .build()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION)
    } else {
      startForeground(NOTIFICATION_ID, notification)
    }
  }

  private fun createNotificationChannelIfNeeded() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        CHANNEL_ID,
        "Simulación de ubicación",
        NotificationManager.IMPORTANCE_LOW,
      )
      val manager = getSystemService(NotificationManager::class.java)
      manager.createNotificationChannel(channel)
    }
  }

  companion object {
    const val ACTION_START = "expo.modules.mocklocation.action.START"
    const val ACTION_STOP = "expo.modules.mocklocation.action.STOP"
    const val ACTION_STOPPED = "expo.modules.mocklocation.action.STOPPED"
    const val EXTRA_LAT = "expo.modules.mocklocation.extra.LAT"
    const val EXTRA_LON = "expo.modules.mocklocation.extra.LON"

    private const val CHANNEL_ID = "mock_location_channel"
    private const val NOTIFICATION_ID = 1001
    private const val UPDATE_INTERVAL_MS = 500L
  }
}
