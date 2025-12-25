import { Platform } from 'react-native';
import { BLE } from 'deeptea-native-ble';

/**
 * realBLE: вспомогательный слой вокруг native BLE для проверки состояния
 * и (на Android) показа системного диалога включения Bluetooth.
 */
export const realBLE = {
  async checkBleState(): Promise<'enabled' | 'disabled' | 'unsupported'> {
    if (!BLE.getBleState) {
      return 'unsupported';
    }
    return await BLE.getBleState();
  },

  async enableBle(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    if (!BLE.enableBluetooth) return false;
    try {
      await BLE.enableBluetooth();
      return true;
    } catch {
      return false;
    }
  },
};