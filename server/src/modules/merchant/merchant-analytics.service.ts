import { Injectable } from '@nestjs/common';
import AppDataSource from '../../datasource';
import { Transaction } from '../../entities/Transaction';

@Injectable()
export class MerchantAnalyticsService {
  private txRepo = AppDataSource.getRepository(Transaction);

  async getDashboardData(merchantId: string) {
    // На данном этапе предполагаем, что merchantId "зашит" в receiver_eid / metadata.
    // В реальном проекте лучше явная связь через таблицу.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60_000);

    const qb = this.txRepo
      .createQueryBuilder('t')
      .where('t.created_at >= :from AND t.created_at < :to', { from: today, to: tomorrow })
      .andWhere('t.status = :status', { status: 'ok' });

    const rows = await qb.getMany();

    const total = rows.reduce((acc, t) => acc + Number(t.amount), 0);
    const avg = rows.length ? total / rows.length : 0;

    return {
      summary: {
        totalToday: total,
        averageTip: avg,
        tipRate: null, // появится, когда будет связь с чеками
      },
      realTime: {
        activeTippers: [], // заполнится через WebSocket/кэш
        pendingVouchers: [],
        recentTips: rows.slice(-20).reverse(),
      },
    };
  }
}

// ---