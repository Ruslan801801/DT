import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export type VoucherState = 'issued' | 'handed_over' | 'awaiting_network' | 'redeemed' | 'revoked' | 'expired';

@Entity({ name: 'vouchers' })
export class Voucher {
@PrimaryGeneratedColumn('uuid')
id!: string;

@Index()
@Column({ type: 'varchar', length: 255 })
issuer_id!: string;

@Index()
@Column({ type: 'varchar', length: 255 })
receiver_eid!: string;

@Column({ type: 'numeric', precision: 14, scale: 2 })
amount!: string;

@Column({ type: 'timestamptz', nullable: true })
expires_at!: Date | null;

@Index()
@Column({ type: 'varchar', length: 32, default: 'issued' })
state!: VoucherState;

@CreateDateColumn({ type: 'timestamptz' })
created_at!: Date;

@UpdateDateColumn({ type: 'timestamptz' })
updated_at!: Date;
}