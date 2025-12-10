/* Jest stateful voucher transitions (pseudo-e2e). Requires running Postgres and .env configured. */
import AppDataSource from '../src/datasource';
import { VoucherRepository } from '../src/modules/vouchers/voucher.repository';
import { VoucherService } from '../src/modules/vouchers/voucher.service';

describe('Voucher state machine', () => {
let repo: VoucherRepository;
let svc: VoucherService;

beforeAll(async () => {
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://deeptea:deeptea@localhost:5432/deeptea';
if (!AppDataSource.isInitialized) await AppDataSource.initialize();
repo = new VoucherRepository();
svc = new VoucherService(repo as any);
});

it('issue → handover → awaiting → redeem', async () => {
const v1 = await svc.issue('issuer_1', 'TEST-EID', 123.45, 24);
expect(v1.state).toBe('issued');
const v2 = await svc.handover(v1.id);
expect(v2.state).toBe('handed_over');
const v3 = await svc.awaitingNetwork(v2.id);
expect(v3.state).toBe('awaiting_network');
const v4 = await svc.redeem(v3.id);
expect(v4.state).toBe('redeemed');
});

it('revocation from allowed states', async () => {
const v1 = await svc.issue('issuer_2', 'EID-2', 50, 1);
const v2 = await svc.revoke(v1.id, 'manual');
expect(v2.state).toBe('revoked');
});
});