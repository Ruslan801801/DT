// Simulate "кофейня": 20–30 devices broadcasting with moderate churn.
import { setTimeout as wait } from 'timers/promises';

const N = Number(process.env.SIM_DEVICES || 25);
const DURATION_MS = Number(process.env.SIM_DURATION || 60_000);

function rssi(base:number){ return base + Math.round((Math.random()-0.5)*8); }

async function main(){
const start = Date.now();
const ids = Array.from({length:N}, (_,i)=>`EID-${i+1}`);
while (Date.now()-start < DURATION_MS){
const now = Date.now();
const devices = ids.map((id,i)=>({ id, rssi: rssi(-50 - i%6*5), ts: now }));
// TODO: POST to a local endpoint or write to a file to emulate arrivals
console.log(JSON.stringify({ ts: now, devices }));
await wait(1000);
}
}
main().catch(e=>{ console.error(e); process.exit(1); });