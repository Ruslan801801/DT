import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import AppDataSource from '../../datasource';
import { SocialTip } from '../../entities/SocialTip';
import { CreateSocialTipDto } from './dto/create-social-tip.dto';
import { P2POrmService } from '../p2p/p2p.orm.service';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class SocialTipsService {
  private repo: Repository<SocialTip>;

  constructor(
    private readonly p2pOrm: P2POrmService,
    private readonly metrics: MetricsService,
  ) {
    this.repo = AppDataSource.getRepository(SocialTip);
  }

  async createWithTransaction(dto: CreateSocialTipDto, idempotencyKey: string) {
    // 1) создаём/переиспользуем P2P-транзакцию
    const { reused, tx } = await this.p2pOrm.createWithIdempotency(idempotencyKey, {
      sender_id: dto.sender_id,
      receiver_eid: dto.receiver_eid,
      amount: dto.amount,
    });

    // 2) социальный слой
    const tip = this.repo.create({
      transaction_id: tx.id,
      sender_id: dto.sender_id,
      receiver_id: 'TBD_RECEIVER_ID', // на данном этапе — заполняется позже через resolve
      amount: tx.amount,
      message: dto.message ?? null,
      anonymity_level: dto.anonymity_level ?? 1,
      media_url: dto.media_url ?? null,
      location: dto.location ?? null,
      tags: dto.tags ?? [],
    });

    const saved = await this.repo.save(tip);
    this.metrics.inc('social_tip_create_total', 'Social tips created');

    return { reused, tx, tip: saved };
  }

  async getReceiverWall(receiverId: string, limit = 100) {
    return this.repo.find({
      where: { receiver_id: receiverId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}

---