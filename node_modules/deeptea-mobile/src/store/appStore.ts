import { create } from 'zustand';
import type { NearbyDevice } from '../../../native/src';

type Device = NearbyDevice & { rssiEma?: number };

type State = {
devices: Device[];
addDevice: (d: NearbyDevice) => void;
reset: () => void;
};

const ALPHA = 0.3; // EMA smoothing factor

function updateEma(prev: number | undefined, current: number): number {
if (prev === undefined || Number.isNaN(prev)) return current;
return ALPHA * current + (1 - ALPHA) * prev;
}

export const useAppStore = create<State>((set) => ({
devices: [],
addDevice: (d) => set((s)=>{
const existing = s.devices.find(x=>x.id===d.id);
const rssiEma = updateEma(existing?.rssiEma, d.rssi);
const updated: Device = { ...d, rssiEma };
const next = [updated, ...s.devices.filter(x=>x.id!==d.id)];
// sort by stronger signal (higher RSSI and EMA)
next.sort((a,b)=> (b.rssiEma ?? b.rssi) - (a.rssiEma ?? a.rssi));
return { devices: next };
}),
reset: () => set({ devices: [] }),
}));