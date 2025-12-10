import { Body, Controller, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { MetricsService } from '../../metrics/metrics.service';

import { IsString, IsNumber, IsOptional, IsPositive, IsInt, Min } from 'class-validator';
class IssueDto { @IsString() issuer_id!: string; @IsString() receiver_eid!: string; @IsNumber() @IsPositive() amount!: number; @IsOptional() @IsInt() @Min(1) ttl_hours?: number; }
class RedeemDto { @IsString() voucher_id!: string; }
class RevokeDto { @IsString() voucher_id!: string; @IsOptional() @IsString() reason?: string; }
class TransitionDto { @IsString() voucher_id!: string; }

@Controller('api/voucher')
export class VouchersController {
constructor(private readonly svc: VoucherService, private readonly metrics: MetricsService) {}

@Post('issue') async issue(@Body() b: IssueDto) {
this.metrics.inc('voucher_issue_total', 'Voucher issue');
const v = await this.svc.issue(b.issuer_id, b.receiver_eid, b.amount, b.ttl_hours ?? 24);
return { state: v.state, voucher_id: v.id, expires_at: v.expires_at };
}
@Post('handover') async handover(@Body() b: TransitionDto) {
this.metrics.inc('voucher_handover_total', 'Voucher handover');
const v = await this.svc.handover(b.voucher_id); return { state: v.state, voucher_id: v.id };
}
@Post('awaiting') async awaiting(@Body() b: TransitionDto) {
this.metrics.inc('voucher_awaiting_total', 'Voucher awaiting network');
const v = await this.svc.awaitingNetwork(b.voucher_id); return { state: v.state, voucher_id: v.id };
}
@Post('redeem') async redeem(@Body() b: RedeemDto) {
this.metrics.inc('voucher_redeem_total', 'Voucher redeem');
const v = await this.svc.redeem(b.voucher_id); return { state: v.state, voucher_id: v.id };
}
@Post('revoke') async revoke(@Body() b: RevokeDto) {
this.metrics.inc('voucher_revoke_total', 'Voucher revoke');
const v = await this.svc.revoke(b.voucher_id, b.reason ?? 'manual'); return { state: v.state, voucher_id: v.id };
}
@Post('pending') pending() { return { items: [] }; }
}