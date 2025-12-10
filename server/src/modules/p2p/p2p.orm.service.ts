import { Injectable } from '@nestjs/common';
import AppDataSource from '../../datasource';
import { Transaction } from '../../entities/Transaction';

@Injectable()
export class P2POrmService {
private initialized = false;

private async init() {
if (!this.initialized) {
if (!AppDataSource.isInitialized) {
await AppDataSource.initialize();
}
this.initialized = true;
}
}

/**
* Persist transaction with DB-level idempotency using unique(idempotency_key)
*/
async createWithIdempotency(key: string, payload: { sender_id: string; receiver_eid: string; amount: number }) {
await this.init();
const repo = AppDataSource.getRepository(Transaction);

// try find existing
const existing = await repo.findOne({ where: { idempotency_key: key } });
if (existing) return { reused: true, tx: existing };

// create new
const tx = repo.create({
sender_id: payload.sender_id,
receiver_eid: payload.receiver_eid,
amount: String(payload.amount.toFixed(2)),
currency: 'RUB',
idempotency_key: key,
status: 'ok',
});
try {
const saved = await repo.save(tx);
return { reused: false, tx: saved };
} catch (e: any) {
// unique violation fallback -> retrieve saved row
const again = await repo.findOne({ where: { idempotency_key: key } });
if (again) return { reused: true, tx: again };
throw e;
}
}
}