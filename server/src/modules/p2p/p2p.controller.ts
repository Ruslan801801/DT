import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { P2PService } from './p2p.service';
import { P2POrmService } from './p2p.orm.service';
import { MetricsService } from '../../metrics/metrics.service';

import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';
class P2PCreateDto {
@IsString() @IsNotEmpty() sender_id!: string;
@IsString() @IsNotEmpty() receiver_eid!: string;
@IsNumber() @IsPositive() amount!: number;
}

@Controller('api/p2p')
let totalRequests = 0; let successRequests = 0;
export class P2PController {
constructor(
private readonly service: P2PService,
private readonly orm: P2POrmService,
private readonly metrics: MetricsService,
) {}

@Post('create')
@HttpCode(HttpStatus.OK)
async create(@Body() body: P2PCreateDto, @Headers('Idempotency-Key') key = '') {
const startedAt = Date.now();
const ttr = this.metrics.histogram('ttr_ms', 'time to response', [50,100,200,500,1000,2000,5000]);
this.metrics.inc('http_requests_total', 'Total HTTP requests'); totalRequests++;

if (!key) {
this.metrics.inc('p2p_missing_idemp_total', 'P2P requests without Idempotency-Key');
ttr.observe(Date.now()-startedAt);
ttr.observe(Date.now()-startedAt);
this.metrics.setGauge('success_online_percent', 'Online success percentage', (successRequests/Math.max(totalRequests,1))*100);
return { code: 'missing_idempotency_key', retryable: false };
}

const useDb = process.env.USE_DB_IDEMP === '1';

if (useDb) {
const { reused, tx } = await this.orm.createWithIdempotency(key, body);
if (reused) {
this.metrics.inc('p2p_idempotency_reuse_total', 'Idempotency reuses (DB)');
ttr.observe(Date.now()-startedAt);
ttr.observe(Date.now()-startedAt);
successRequests++; this.metrics.setGauge('success_online_percent', 'Online success percentage', (successRequests/Math.max(totalRequests,1))*100);
return { code: 'idempotency_reuse', status: tx.status, tx_id: tx.id, echo: body, idempotency_key: key };
}
this.metrics.inc('p2p_create_total', 'P2P create (DB)');
ttr.observe(Date.now()-startedAt);
ttr.observe(Date.now()-startedAt);
successRequests++; this.metrics.setGauge('success_online_percent', 'Online success percentage', (successRequests/Math.max(totalRequests,1))*100);
return { status: tx.status, tx_id: tx.id, echo: body, idempotency_key: key };
}

const { reused, response } = await this.service.createOnce(key, body);
if (reused) {
this.metrics.inc('p2p_idempotency_reuse_total', 'Idempotency reuses (memory)');
ttr.observe(Date.now()-startedAt);
ttr.observe(Date.now()-startedAt);
successRequests++; this.metrics.setGauge('success_online_percent', 'Online success percentage', (successRequests/Math.max(totalRequests,1))*100);
return { code: 'idempotency_reuse', ...response };
}
this.metrics.inc('p2p_create_total', 'P2P create (memory)');
ttr.observe(Date.now()-startedAt);
ttr.observe(Date.now()-startedAt);
successRequests++; this.metrics.setGauge('success_online_percent', 'Online success percentage', (successRequests/Math.max(totalRequests,1))*100);
return response;
}

@Post('undo')
undo() {
this.metrics.inc('p2p_undo_total', 'P2P undo calls');
return { undone: true };
}
}