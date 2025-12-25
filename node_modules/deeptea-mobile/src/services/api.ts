export const api = {
async p2pCreate(body: { sender_id: string; receiver_eid: string; amount: number }) {
const res = await fetch('http://localhost:3000/api/p2p/create', {
method: 'POST',
headers: { 'Content-Type':'application/json', 'Idempotency-Key': cryptoRandom() },
body: JSON.stringify(body),
});
return res.json();
},
async bleResolve(eid: string) {
const res = await fetch('http://localhost:3000/api/ble/resolve', {
method: 'POST',
headers: { 'Content-Type':'application/json' },
body: JSON.stringify({ eid }),
});
return res.json();
}
};
function cryptoRandom() {
// fallback for RN without crypto.randomUUID()
const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}:create`;
}