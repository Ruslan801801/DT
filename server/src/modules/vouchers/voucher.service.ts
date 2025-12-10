import { Injectable, BadRequestException } from '@nestjs/common';
import { VoucherRepository } from './voucher.repository';
import type { Voucher } from '../../entities/Voucher';

type Ctx = { now?: Date };

@Injectable()
export class VoucherService {
constructor(private readonly repo: VoucherRepository) {}

async issue(issuer_id: string, receiver_eid: string, amount: number, ttlHours = 24, ctx: Ctx = {}) {
const expires_at = new Date((ctx.now?.getTime() ?? Date.now()) + ttlHours * 3600 * 1000);
return this.repo.create(issuer_id, receiver_eid, amount, expires_at);
}

async handover(id: string) {
const v = await this.must(id);
this.assertState(v.state, ['issued']);
await this.repo.setState(id, 'handed_over');
return this.must(id);
}

async awaitingNetwork(id: string) {
const v = await this.must(id);
this.assertState(v.state, ['handed_over']);
await this.repo.setState(id, 'awaiting_network');
return this.must(id);
}

async redeem(id: string) {
const v = await this.must(id);
this.assertState(v.state, ['awaiting_network','handed_over','issued']);
await this.repo.setState(id, 'redeemed');
return this.must(id);
}

async revoke(id: string, reason = 'manual') {
const v = await this.must(id);
this.assertState(v.state, ['issued','handed_over','awaiting_network']);
await this.repo.setState(id, 'revoked');
return this.must(id);
}

private async must(id: string): Promise<Voucher> {
const v = await this.repo.findById(id);
if (!v) throw new BadRequestException('voucher_not_found');
return v;
}

private assertState(curr: string, allowed: string[]) {
if (!allowed.includes(curr)) throw new BadRequestException(`invalid_state_transition:${curr}->(${allowed.join('|')})`);
}
}