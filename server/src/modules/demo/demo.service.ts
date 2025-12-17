import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

type DemoUser = { id: string; name: string; token: string };

type DemoTip = {
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

  login(name?: string) {
    const user: DemoUser = {
      id: randomUUID(),
      name: (name || 'DemoUser').slice(0, 32),
      token: 'dt_demo_' + randomUUID(),
    };
    this.usersByToken.set(user.token, user);
    return user;
  }

  createTip(opts: {
    fromToken?: string;
    toName: string;
    amount: number;
    message?: string;
  }) {
    const token = opts.fromToken || '';
    const u = this.usersByToken.get(token);
    const from = u ? u.name : 'Anonymous';

    const tip: DemoTip = {
      id: randomUUID(),
      from,
      to: opts.toName.slice(0, 32),
      amount: opts.amount,
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
