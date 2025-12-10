// Simulate "час-пик": 50+ devices with high churn and mobility.
import { setTimeout as wait } from 'timers/promises';

const N = Number(process.env.SIM_DEVICES || 60);
const DURATION_MS = Number(process.env.SIM_DURATION || 60_000);

function rssi(){ return -40 - Math.round(Math.random()*50); }

async function main(){
const start = Date.now();
let ids = Array.from({length:N}, (_,i)=>`EID-${i+1}`);
while (Date.now()-start < DURATION_MS){
const now = Date.now();
// churn: shuffle and drop/add ids
ids = ids.sort(()=>Math.random()-0.5).slice(0, Math.max(10, Math.floor(Math.random()*N)));
while (ids.length < N) ids.push(`EID-${Math.floor(Math.random()*1000)}`);
const devices = ids.slice(0, Math.min(ids.length, 80)).map((id)=>({ id, rssi: rssi(), ts: now }));
console.log(JSON.stringify({ ts: now, devices }));
await wait(800);
}
}
main().catch(e=>{ console.error(e); process.exit(1); });