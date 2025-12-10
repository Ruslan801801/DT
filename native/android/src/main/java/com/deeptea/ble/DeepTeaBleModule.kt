// DeepTeaBleModule.kt
// React Native BLE native module for DeepTea.
// Реальный BLE-сканер + реклама EID через service data.
// Методы getBleState / enableBluetooth для контроля состояния.

package com.deeptea.ble

import android.Manifest
import android.app.Activity
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.pm.PackageManager
import android.os.Build
import android.os.ParcelUuid
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.nio.charset.Charset
import java.util.UUID

class DeepTeaBleModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "DeepTeaBleModule"

    // UUID сервиса, через который будем рекламировать EID в service data.
    private val DEEPTEA_SERVICE_UUID: UUID =
        UUID.fromString("0000deet-0000-1000-8000-00805f9b34fb")

    private val bluetoothManager: BluetoothManager? by lazy {
        reactContext.getSystemService(ReactApplicationContext.BLUETOOTH_SERVICE) as? BluetoothManager
    }

    private val bluetoothAdapter: BluetoothAdapter?
        get() = bluetoothManager?.adapter

    private val scanner: BluetoothLeScanner?
        get() = bluetoothAdapter?.bluetoothLeScanner

    private val advertiser: BluetoothLeAdvertiser?
        get() = bluetoothAdapter?.bluetoothLeAdvertiser

    @Volatile
    private var isScanning: Boolean = false

    @Volatile
    private var isAdvertising: Boolean = false

    private var scanCallback: ScanCallback? = null
    private var advertiseCallback: AdvertiseCallback? = null

    // === Public API, вызываемый из JS ===

    @ReactMethod
    fun getBleState(promise: Promise) {
        val adapter = bluetoothAdapter
        when {
            adapter == null -> promise.resolve("unsupported")
            !adapter.isEnabled -> promise.resolve("disabled")
            else -> promise.resolve("enabled")
        }
    }

    @ReactMethod
    fun enableBluetooth(promise: Promise) {
        val adapter = bluetoothAdapter
        if (adapter == null) {
            promise.reject("BLE_UNSUPPORTED", "Bluetooth adapter is null")
            return
        }
        if (adapter.isEnabled) {
            promise.resolve(true)
            return
        }
        val currentActivity: Activity? = currentActivity
        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "No current activity to show enable dialog")
            return
        }
        try {
            val intent = android.content.Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            currentActivity.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("BLE_ENABLE_FAILED", e.message, e)
        }
    }

    @ReactMethod
    fun startScanning(promise: Promise) {
        val adapter = bluetoothAdapter
        if (adapter == null || !adapter.isEnabled) {
            promise.reject("BLE_UNAVAILABLE", "Bluetooth adapter not available or disabled")
            return
        }

        if (!hasScanPermission()) {
            promise.reject("BLE_PERMISSION", "Missing BLUETOOTH_SCAN / location permission")
            return
        }

        if (isScanning) {
            promise.resolve(null)
            return
        }

        val leScanner = scanner
        if (leScanner == null) {
            promise.reject("BLE_UNAVAILABLE", "BluetoothLeScanner is null")
            return
        }

        val settings = ScanSettings.Builder()
            .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
            .build()

        val filters = listOf(
            ScanFilter.Builder()
                .setServiceUuid(ParcelUuid(DEEPTEA_SERVICE_UUID))
                .build()
        )

        val callback = object : ScanCallback() {
            override fun onScanResult(callbackType: Int, result: ScanResult?) {
                result?.let { handleScanResult(it) }
            }

            override fun onBatchScanResults(results: MutableList<ScanResult>?) {
                results?.forEach { handleScanResult(it) }
            }

            override fun onScanFailed(errorCode: Int) {
                sendStateChanged("error", "Scan failed: $errorCode")
            }
        }

        scanCallback = callback
        leScanner.startScan(filters, settings, callback)
        isScanning = true
        sendStateChanged("scanning", null)
        promise.resolve(null)
    }

    @ReactMethod
    fun stopScanning(promise: Promise) {
        if (!isScanning) {
            promise.resolve(null)
            return
        }
        val leScanner = scanner
        val callback = scanCallback
        if (leScanner != null && callback != null) {
            leScanner.stopScan(callback)
        }
        scanCallback = null
        isScanning = false
        updateIdleIfNeeded()
        promise.resolve(null)
    }

    @ReactMethod
    fun advertise(eid: String, promise: Promise) {
        val adapter = bluetoothAdapter
        if (adapter == null || !adapter.isEnabled) {
            promise.reject("BLE_UNAVAILABLE", "Bluetooth adapter not available or disabled")
            return
        }
        if (!hasAdvertisePermission()) {
            promise.reject("BLE_PERMISSION", "Missing BLUETOOTH_ADVERTISE permission")
            return
        }
        val adv = advertiser
        if (adv == null) {
            promise.reject("BLE_UNAVAILABLE", "BluetoothLeAdvertiser is null")
            return
        }

        if (isAdvertising) {
            stopCurrentAdvertising()
        }

        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
            .setConnectable(false)
            .setTimeout(0)
            .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM)
            .build()

        val serviceUuid = ParcelUuid(DEEPTEA_SERVICE_UUID)

        val eidBytesFull = eid.toByteArray(Charset.forName("UTF-8"))
        val eidBytes = if (eidBytesFull.size > 18) {
            eidBytesFull.copyOf(18)
        } else {
            eidBytesFull
        }

        val data = AdvertiseData.Builder()
            .addServiceUuid(serviceUuid)
            .addServiceData(serviceUuid, eidBytes)
            .setIncludeDeviceName(false)
            .build()

        val callback = object : AdvertiseCallback() {
            override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
                isAdvertising = true
                sendStateChanged("advertising", null)
            }

            override fun onStartFailure(errorCode: Int) {
                sendStateChanged("error", "Advertise failed: $errorCode")
            }
        }

        advertiseCallback = callback
        adv.startAdvertising(settings, data, callback)
        promise.resolve(null)
    }

    @ReactMethod
    fun stopAdvertising(promise: Promise) {
        stopCurrentAdvertising()
        promise.resolve(null)
    }

    @ReactMethod
    fun onDeviceTestEvent(promise: Promise) {
        val now = System.currentTimeMillis()
        val payload = Arguments.createMap().apply {
            putString("type", "device")
            putString("id", "TEST-EID-NATIVE")
            putInt("rssi", -55)
            putDouble("ts", now.toDouble())
        }
        sendEvent("DeepTeaBleEvent", payload)
        promise.resolve(null)
    }

    private fun stopCurrentAdvertising() {
        val adv = advertiser
        val callback = advertiseCallback
        if (adv != null && callback != null) {
            adv.stopAdvertising(callback)
        }
        advertiseCallback = null
        isAdvertising = false
        updateIdleIfNeeded()
    }

    private fun hasScanPermission(): Boolean {
        val ctx = reactContext
        val scanOk = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            ContextCompat.checkSelfPermission(ctx, Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
        val locationOk = ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
        return scanOk && locationOk
    }

    private fun hasAdvertisePermission(): Boolean {
        val ctx = reactContext
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            ContextCompat.checkSelfPermission(ctx, Manifest.permission.BLUETOOTH_ADVERTISE) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
    }

    private fun handleScanResult(result: ScanResult) {
        val record = result.scanRecord ?: return

        val serviceData = record.getServiceData(ParcelUuid(DEEPTEA_SERVICE_UUID))
        val eid: String? = serviceData?.let {
            try {
                String(it, Charset.forName("UTF-8"))
            } catch (e: Exception) {
                null
            }
        }

        if (eid.isNullOrEmpty()) {
            return
        }

        val now = System.currentTimeMillis()
        val map: WritableMap = Arguments.createMap().apply {
            putString("type", "device")
            putString("id", eid)
            putInt("rssi", result.rssi)
            putDouble("ts", now.toDouble())
        }
        sendEvent("DeepTeaBleEvent", map)
    }

    private fun updateIdleIfNeeded() {
        if (!isScanning && !isAdvertising) {
            sendStateChanged("idle", null)
        }
    }

    private fun sendStateChanged(state: String, error: String?) {
        val map = Arguments.createMap().apply {
            putString("type", "state_changed")
            putString("state", state)
            if (error != null) putString("error", error)
        }
        sendEvent("DeepTeaBleEvent", map)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}