import { Controller, Get } from '@nestjs/common';
import AppDataSource from '../../datasource';
import { createClient } from 'redis';

@Controller('health') // если в main.ts setGlobalPrefix('api'), будет /api/health
export class HealthController {
  @Get()
  health() {
    return { ok: true, ts: new Date().toISOString() };
  }

  @Get('ready')
  async readiness() {
    const status: any = { ok: true, ts: new Date().toISOString(), checks: {} as any };

    // DB check
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      await AppDataSource.query('SELECT 1');
      status.checks.db = 'ok';
    } catch (e: any) {
      status.ok = false;
      status.checks.db = `down:${e?.message ?? String(e)}`;
    }

    // Redis check (optional)
    try {
      const url = process.env.REDIS_URL;
      if (url) {
        const c = createClient({ url });
        await c.connect();
        const pong = await c.ping();
        await c.disconnect();
        status.checks.redis = pong === 'PONG' ? 'ok' : `down:${pong}`;
        if (pong !== 'PONG') status.ok = false;
      } else {
        status.checks.redis = 'not_configured';
      }
    } catch (e: any) {
      status.ok = false;
      status.checks.redis = `down:${e?.message ?? String(e)}`;
    }

    return status;
  }
}
