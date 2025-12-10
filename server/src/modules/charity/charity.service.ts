import { Injectable } from '@nestjs/common';
import AppDataSource from '../../datasource';
import { CharityOrganization } from '../../entities/CharityOrganization';
import { CharityDonation } from '../../entities/CharityDonation';
import { P2POrmService } from '../p2p/p2p.orm.service';

@Injectable()
export class CharityService {
  private orgRepo = AppDataSource.getRepository(CharityOrganization);
  private donationRepo = AppDataSource.getRepository(CharityDonation);

  constructor(private readonly p2pOrm: P2POrmService) {}

  async listCharities(location?: string, categories?: string[]) {
    // MVP: игнорируем фильтры или используем простую выборку
    return this.orgRepo.find({
      order: { recommended: 'DESC', name: 'ASC' },
      take: 50,
    });
  }

  async createCharityTip(params: {
    sender_id: string;
    receiver_eid: string;
    tip_amount: number;
    donation_amount: number;
    charity_id: string;
    message?: string;
    idempotencyKey: string;
  }) {
    // 1. создаём P2P-транзакцию для части, идущей получателю
    const { tx } = await this.p2pOrm.createWithIdempotency(params.idempotencyKey, {
      sender_id: params.sender_id,
      receiver_eid: params.receiver_eid,
      amount: params.tip_amount - params.donation_amount,
    });

    // 2. фиксируем donation (off-chain)
    const donation = this.donationRepo.create({
      transaction_id: tx.id,
      charity_id: params.charity_id,
      amount: String(params.donation_amount.toFixed(2)),
      matched_amount: '0',
      message: params.message ?? null,
    });
    const saved = await this.donationRepo.save(donation);

    return { tx, donation: saved };
  }
}

---