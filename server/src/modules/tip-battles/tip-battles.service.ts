import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import AppDataSource from '../../datasource';
import { TipBattle } from '../../entities/TipBattle';
import { TipBattleParticipant } from '../../entities/TipBattleParticipant';
import { MetricsService } from '../../metrics/metrics.service';

type BattleConfig = {
  type: 'solo' | 'team' | 'royale';
  merchant_id: string;
  duration_min: number;
};

@Injectable()
export class TipBattlesService {
  private battles: Repository<TipBattle>;
  private participants: Repository<TipBattleParticipant>;

  constructor(private readonly metrics: MetricsService) {
    this.battles = AppDataSource.getRepository(TipBattle);
    this.participants = AppDataSource.getRepository(TipBattleParticipant);
  }

  async createBattle(cfg: BattleConfig) {
    const now = new Date();
    const battle = this.battles.create({
      type: cfg.type,
      merchant_id: cfg.merchant_id,
      start_time: now,
      end_time: new Date(now.getTime() + cfg.duration_min * 60_000),
      status: 'active',
      pot: '0',
    });
    const saved = await this.battles.save(battle);
    this.metrics.inc('tip_battle_create_total', 'Tip battles created');
    return saved;
  }

  async joinBattle(battleId: string, userId: string) {
    const existing = await this.participants.findOne({ where: { battle_id: battleId, user_id: userId } });
    if (existing) return existing;
    const p = this.participants.create({ battle_id: battleId, user_id: userId, score: '0' });
    return this.participants.save(p);
  }

  async applyTip(battleId: string, userId: string, amount: number) {
    const battle = await this.battles.findOne({ where: { id: battleId } });
    if (!battle || battle.status !== 'active') return;

    await this.joinBattle(battleId, userId);

    await this.participants.increment({ battle_id: battleId, user_id: userId }, 'score', amount);
    await this.battles.increment({ id: battleId }, 'pot', amount);

    this.metrics.inc('tip_battle_tip_total', 'Tips inside battle');
  }

  async leaderboard(battleId: string, limit = 20) {
    return this.participants.find({
      where: { battle_id: battleId },
      order: { score: 'DESC' },
      take: limit,
    });
  }

  async closeExpiredBattles() {
    const now = new Date();
    const expired = await this.battles.find({
      where: { status: 'active', end_time: (value: any) => value < now } as any,
    });
    for (const b of expired) {
      b.status = 'finished';
      await this.battles.save(b);
    }
  }
}

// ---