import AppDataSource from '../../datasource';
import { Voucher, VoucherState } from '../../entities/Voucher';
import { VoucherEvent } from '../../entities/VoucherEvent';

export class VoucherRepository {
private async repo() { if (!AppDataSource.isInitialized) await AppDataSource.initialize(); return AppDataSource.getRepository(Voucher); }
private async events() { if (!AppDataSource.isInitialized) await AppDataSource.initialize(); return AppDataSource.getRepository(VoucherEvent); }

async create(issuer_id: string, receiver_eid: string, amount: number, expires_at: Date | null) {
const r = await this.repo();
const v = r.create({ issuer_id, receiver_eid, amount: String(amount.toFixed(2)), expires_at, state: 'issued' });
const saved = await r.save(v);
await this.appendEvent(saved.id, 'issue', { amount, receiver_eid });
return saved;
}

private async appendEvent(voucher_id: string, type: string, data: Record<string, any>) {
const er = await this.events();
const e = er.create({ voucher_id, type, data });
await er.save(e);
}

async findById(id: string) {
const r = await this.repo();
return r.findOne({ where: { id } });
}

async setState(id: string, to: VoucherState) {
const r = await this.repo();
await r.update({ id }, { state: to });
}
}