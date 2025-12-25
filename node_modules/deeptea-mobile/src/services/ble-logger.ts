import { Platform } from 'react-native';
import type { NearbyDevice } from 'deeptea-native-ble';

export type BleScanLog = {
  deviceCount: number;
  durationMs: number;
  os: string;
  timestamp: number;
};

/**
 * BLE logger: можно повесить на успешные/неуспешные сканы
 * и отправлять телеметрию на backend / стороннюю аналитику.
 */
export const bleLogger = {
  logScanEvent(devices: NearbyDevice[], duration: number) {
    const payload: BleScanLog = {
      deviceCount: devices.length,
      durationMs: duration,
      os: Platform.OS,
      timestamp: Date.now(),
    };

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[BLE scan]', payload);
      return;
    }

    // TODO: отправить payload на backend / analytics SDK
    // fetch(`${API_URL}/metrics/ble-scan`, { method: 'POST', body: JSON.stringify(payload) })
  },
};