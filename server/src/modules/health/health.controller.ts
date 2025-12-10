import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import AppDataSource from '../../datasource';
import { createClient } from 'redis';
import { MetricsService } from '../../metrics/metrics.service';

@Controller()
export class HealthController {
constructor(private readonly metrics: MetricsService) {}

@Get('/health')
async health() {
const status: any = { ok: true, ts: new Date().toISOString() };

// Postgres
try {
if (!AppDataSource.isInitialized) await AppDataSource.initialize();
await AppDataSource.query('SELECT 1');
status.db = 'ok';
} catch (e: any) {
status.ok = false; status.db = 'down'; status.db_error = e.message;
}

// Redis
try {
const url = process.env.REDIS_URL;
if (url) {
const client = createClient({ url });
await client.connect();
const pong = await client.ping();
await client.disconnect();
status.redis = pong === 'PONG' ? 'ok' : 'down';
if (pong !== 'PONG') status.ok = false;
} else {
status.redis = 'not_configured';
}
} catch (e: any) {
status.ok = false; status.redis = 'down'; status.redis_error = e.message;
}

return status;
}

@Get('/metrics')
metricsEndpoint(@Res() res: Response) {
res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
res.send(this.metrics.text());
}
}

import AppDataSource from '../../datasource';
import { createClient } from 'redis';

@Get('/ready')
async readiness() {
const status: any = { ok: true, ts: new Date().toISOString(), checks: {} };
try { if (!AppDataSource.isInitialized) await AppDataSource.initialize(); await AppDataSource.query('SELECT 1'); status.checks.db = 'ok'; } catch(e:any){ status.ok=false; status.checks.db = 'down:'+e.message; }
try { 
if (process.env.REDIS_URL){ const c = createClient({ url: process.env.REDIS_URL }); await c.connect(); const pong = await c.ping(); await c.disconnect(); status.checks.redis = pong==='PONG'?'ok':'down'; if(pong!=='PONG') status.ok=false; }
else status.checks.redis = 'not_configured';
} catch(e:any){ status.ok=false; status.checks.redis='down:'+e.message; }
return status;
}