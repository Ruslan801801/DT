// @jest-environment node
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';
import AppDataSource from '../../src/datasource';
import { P2POrmService } from '../../src/modules/p2p/p2p.orm.service';

jest.setTimeout(180000);

describe('P2P idempotency (DB + Redis)', () => {
let pg: StartedTestContainer;
let redis: StartedTestContainer;

beforeAll(async () => {
pg = await new PostgreSqlContainer('postgres:15').withDatabase('deeptea').withUsername('deeptea').withPassword('deeptea').start();
redis = await new RedisContainer('redis:7-alpine').start();
process.env.DATABASE_URL = pg.getConnectionUri();
process.env.REDIS_URL = `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`;
if (!AppDataSource.isInitialized) await AppDataSource.initialize();
});

afterAll(async () => {
if (AppDataSource.isInitialized) await AppDataSource.destroy();
if (redis) await redis.stop();
if (pg) await pg.stop();
});

it('reuses idempotency key', async () => {
const svc = new P2POrmService();
const key = 'idem-test-123';
const a = await svc.createWithIdempotency(key, { sender_id:'s1', receiver_eid:'r1', amount: 10 });
const b = await svc.createWithIdempotency(key, { sender_id:'s1', receiver_eid:'r1', amount: 10 });
expect(a.reused).toBe(false);
expect(b.reused).toBe(true);
expect(a.tx.id).toBe(b.tx.id);
});
});