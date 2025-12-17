import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'charity_donations' })
export class CharityDonation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  transaction_id!: string; // связана с P2P транзакцией

  @Index()
  @Column({ type: 'uuid' })
  charity_id!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  matched_amount!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  message!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}

// ---