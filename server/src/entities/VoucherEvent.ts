import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'voucher_events' })
export class VoucherEvent {
@PrimaryGeneratedColumn('uuid')
id!: string;

@Index()
@Column({ type: 'uuid' })
voucher_id!: string;

@Index()
@Column({ type: 'varchar', length: 64 })
type!: string; // issue|handover|redeem|revoke|expire

@Column({ type: 'jsonb', default: {} })
data!: Record<string, any>;

@CreateDateColumn({ type: 'timestamptz' })
created_at!: Date;
}