import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type DemoUser = {
  id: string;
  name: string;
  token: string;
  createdAt: string;
};

export type DemoTip = {
  id: string;
  from: string;
  to: string;
  amount: number;
  message?: string;
  createdAt: string;
};

@Injectable()
export class DemoService {
  private usersByToken = new Map<string, DemoUser>();
  private tips: DemoTip[] = [];

  constructor() {
    // чтобы продукт “не был пустым” сразу после старта
    this.reset(true);
  }

  health() {
    const v = (process.env.DEMO_MODE || '').toLowerCase();
    return {
      ok: true,
      demo_mode: v === '1' || v === 'true' || v === 'yes',
      users: this.usersByToken.size,
      tips: this.tips.length,
      ts: new Date().toISOString(),
    };
  }

  reset(seed = true) {
    this.usersByToken.clear();
    this.tips = [];
    if (seed) this.seed();
    return this.health();
  }

  seed() {
    const alice = this.login('Alice');
    const bob = this.login('Bob');
    const cafe = this.login('Cafe');

    this.createTip({ fromToken: alice.token, toName: 'Bob', amount: 150, message: 'Thanks 🙌' });
    this.createTip({ fromToken: bob.token, toName: 'Cafe', amount: 220, message: 'Great coffee ☕' });
    this.createTip({ fromToken: cafe.token, toName: 'Alice', amount: 80, message: 'Welcome back!' });

    return { ok: true, seed: true };
  }

  login(name?: string) {
    const user: DemoUser = {
      id: randomUUID(),
      name: (name || 'DemoUser').slice(0, 32),
      token: 'dt_demo_' + randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.usersByToken.set(user.token, user);
    return user;
  }

  createTip(opts: { fromToken?: string; toName: string; amount: number; message?: string }) {
    const token = opts.fromToken || '';
    const u = this.usersByToken.get(token);
    const from = u ? u.name : 'Anonymous';

    const tip: DemoTip = {
      id: randomUUID(),
      from,
      to: opts.toName.slice(0, 32),
      amount: Number(opts.amount) || 0,
      message: opts.message,
      createdAt: new Date().toISOString(),
    };

    this.tips.unshift(tip);
    this.tips = this.tips.slice(0, 50);
    return tip;
  }

  feed() {
    return this.tips;
  }
}
