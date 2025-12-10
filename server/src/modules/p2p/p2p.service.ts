import { Injectable, OnModuleInit } from '@nestjs/common';

type CacheRecord = { ts: number; res: any };

/**
* Idempotency storage with Redis SETNX+TTL fallback to in-memory Map.
* REDIS_URL env enables Redis mode.
*/
@Injectable()
export class P2PService implements OnModuleInit {
private cache = new Map<string, CacheRecord>();
private TTL_MS = 24 * 60 * 60 * 1000;

private useRedis = false;
private redis: any | null = null;

async onModuleInit() {
const url = process.env.REDIS_URL;
if (url) {
try {
// Lazy import to avoid hard dependency in this skeleton
const { createClient } = await import('redis');
this.redis = createClient({ url });
this.redis.on('error', (err: any) => console.error('[redis] error', err));
await this.redis.connect();
this.useRedis = true;
// eslint-disable-next-line no-console
console.log('[P2PService] Redis idempotency enabled');
} catch (e) {
console.warn('[P2PService] Redis not available, falling back to in-memory:', (e as Error).message);
}
}
}

private async setIfAbsentRedis(key: string, value: any, ttlSec: number): Promise<{created:boolean}> {
if (!this.redis) return { created: false };
// SET key value NX EX ttl
const ok = await this.redis.set(key, JSON.stringify(value), { NX: true, EX: ttlSec });
return { created: ok === 'OK' };
}

private async getRedis(key: string): Promise<any | null> {
if (!this.redis) return null;
const v = await this.redis.get(key);
return v ? JSON.parse(v) : null;
}

async createOnce(key: string, payload: any) {
const ttlSec = Math.floor(this.TTL_MS / 1000);

if (this.useRedis && this.redis) {
const existing = await this.getRedis(key);
if (existing) {
return { reused: true, response: existing };
}
const tx_id = 'tx_' + Math.random().toString(36).slice(2);
const res = { status: 'ok', tx_id, echo: payload, idempotency_key: key };
const { created } = await this.setIfAbsentRedis(key, res, ttlSec);
if (!created) {
const reused = await this.getRedis(key);
return { reused: true, response: reused };
}
return { reused: false, response: res };
}

// In-memory fallback
const now = Date.now();
const cached = this.cache.get(key);
if (cached && (now - cached.ts) < this.TTL_MS) {
return { reused: true, response: cached.res };
}
const tx_id = 'tx_' + Math.random().toString(36).slice(2);
const res = { status: 'ok', tx_id, echo: payload, idempotency_key: key };
this.cache.set(key, { ts: now, res });
return { reused: false, response: res };
}
}