/**
 * BLE service for DeepTea.
 *
 * Пробует использовать native BLE-модуль (deeptea-native-ble).
 * Если он недоступен (web / ранняя разработка) — использует старый mock.
 */
import { EventEmitter } from 'events';
import { useAppStore } from '../store/appStore';
import type { NearbyDevice, BLEModule } from 'deeptea-native-ble';

type Device = { id: string; rssi: number; ts: number };

const emitter = new EventEmitter();
let mockTimer: any = null;

let nativeBLE: BLEModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('deeptea-native-ble') as { BLE: BLEModule };
  if (mod && mod.BLE) {
    nativeBLE = mod.BLE;
  }
} catch {
  nativeBLE = null;
}

// Mock generator: dynamic RSSI for a fixed pool of sample IDs
const SAMPLE_IDS = ['TEST-EID', 'EID-1', 'EID-2', 'EID-3', 'EID-4'];

function randomRssi(base: number) {
  return base + Math.round((Math.random() - 0.5) * 10); // ±5 dBm
}

function startMockLoop() {
  if (mockTimer) return;
  mockTimer = setInterval(() => {
    const now = Date.now();
    const storeAdd = useAppStore.getState().addDevice;
    const data: Device[] = SAMPLE_IDS.map((id, idx) => ({
      id,
      rssi: randomRssi(-55 - idx * 5),
      ts: now,
    }));
    data.forEach((d) => {
      storeAdd(d);
      emitter.emit('device', d);
    });
  }, 1000);
}

function stopMockLoop() {
  if (mockTimer) clearInterval(mockTimer);
  mockTimer = null;
}

export const ble = {
  onDevice(cb: (d: Device) => void) {
    emitter.on('device', cb);
    return () => emitter.off('device', cb);
  },

  async startScanning() {
    const storeAdd = useAppStore.getState().addDevice;

    if (nativeBLE) {
      nativeBLE.onDevice((dev: NearbyDevice) => {
        const device: Device = { id: dev.id, rssi: dev.rssi, ts: dev.ts };
        storeAdd(device);
        emitter.emit('device', device);
      });
      await nativeBLE.startScanning();
      return;
    }

    // Fallback: mock
    startMockLoop();
  },

  async stopScanning() {
    if (nativeBLE) {
      await nativeBLE.stopScanning();
      return;
    }
    stopMockLoop();
  },

  async advertise(eid: string) {
    if (nativeBLE) {
      await nativeBLE.advertise(eid);
    }
  },

  async stopAdvertising() {
    if (nativeBLE) {
      await nativeBLE.stopAdvertising();
    }
  },
};