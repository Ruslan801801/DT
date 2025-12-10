// Public TypeScript interface for the RN BLE native module

export interface NearbyDevice {
  id: string;       // ephemeral id (EID)
  rssi: number;
  ts: number;       // timestamp of observation (ms)
}

export interface BLEModule {
  startScanning(): Promise<void>;
  stopScanning(): Promise<void>;
  advertise(eid: string): Promise<void>;
  stopAdvertising(): Promise<void>;
  onDevice(callback: (d: NearbyDevice) => void): () => void; // returns unsubscribe

  getBleState?(): Promise<'enabled' | 'disabled' | 'unsupported'>;
  enableBluetooth?(): Promise<boolean>;
}

import { NativeModules, NativeEventEmitter } from 'react-native';

// Android: DeepTeaBleModule, iOS: BLEModule
const NativeBle: any =
  (NativeModules as any).DeepTeaBleModule ||
  (NativeModules as any).BLEModule ||
  null;

const emitter = NativeBle ? new NativeEventEmitter(NativeBle) : null;

export const BLE: BLEModule = {
  async startScanning() {
    if (!NativeBle?.startScanning) return;
    await NativeBle.startScanning();
  },
  async stopScanning() {
    if (!NativeBle?.stopScanning) return;
    await NativeBle.stopScanning();
  },
  async advertise(eid: string) {
    if (!NativeBle?.advertise) return;
    await NativeBle.advertise(eid);
  },
  async stopAdvertising() {
    if (!NativeBle?.stopAdvertising) return;
    await NativeBle.stopAdvertising();
  },
  async getBleState() {
    if (!NativeBle?.getBleState) return 'unsupported';
    return await NativeBle.getBleState();
  },
  async enableBluetooth() {
    if (!NativeBle?.enableBluetooth) return false;
    try {
      await NativeBle.enableBluetooth();
      return true;
    } catch {
      return false;
    }
  },
  onDevice(callback: (d: NearbyDevice) => void): () => void {
    if (!emitter) {
      return () => {};
    }
    const subscription = emitter.addListener('DeepTeaBleEvent', (event: any) => {
      if (event?.type === 'device') {
        const dev: NearbyDevice = {
          id: String(event.id ?? ''),
          rssi: typeof event.rssi === 'number' ? event.rssi : -100,
          ts: typeof event.ts === 'number' ? event.ts : Date.now(),
        };
        callback(dev);
      }
    });
    return () => {
      subscription.remove();
    };
  },
};