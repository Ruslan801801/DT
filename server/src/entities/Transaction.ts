import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export type TxStatus = 'pending' | 'ok' | 'failed' | 'undone';

@Entity({ name: 'transactions' })
export class Transaction {
@PrimaryGeneratedColumn('uuid')
id!: string;

@Index()
@Column({ type: 'varchar', length: 255 })
sender_id!: string;

@Index()
@Column({ type: 'varchar', length: 255 })
receiver_eid!: string;

@Column({ type: 'numeric', precision: 14, scale: 2 })
amount!: string;

@Column({ type: 'varchar', length: 32 })
currency!: string;

@Index({ unique: true })
@Column({ type: 'varchar', length: 128 })
idempotency_key!: string;

@Column({ type: 'varchar', length: 32, default: 'pending' })
status!: TxStatus;

@CreateDateColumn({ type: 'timestamptz' })
created_at!: Date;

@UpdateDateColumn({ type: 'timestamptz' })
updated_at!: Date;
}