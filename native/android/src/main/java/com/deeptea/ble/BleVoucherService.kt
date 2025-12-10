// BleVoucherService.kt
// Foreground Android Service skeleton for DeepTea BLE.

package com.deeptea.ble

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder

class BleVoucherService : Service() {

    override fun onCreate() {
        super.onCreate()
        startForegroundIfNeeded()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun startForegroundIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelId = "deeptea_ble_channel"
            val channelName = "DeepTea BLE"
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_LOW
            )
            manager.createNotificationChannel(channel)

            val notification: Notification = Notification.Builder(this, channelId)
                .setContentTitle("DeepTea BLE")
                .setContentText("Discovering nearby devices for DeepTea tips")
                .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
                .build()

            startForeground(1, notification)
        }
    }
}