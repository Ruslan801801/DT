import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export type TipBattleStatus = 'active' | 'finished' | 'cancelled';

@Entity({ name: 'tip_battles' })
export class TipBattle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 32 })
  type!: string; // solo|team|royale

  @Index()
  @Column({ type: 'varchar', length: 255 })
  merchant_id!: string;

  @Column({ type: 'timestamptz' })
  start_time!: Date;

  @Column({ type: 'timestamptz' })
  end_time!: Date;

  @Column({ type: 'varchar', length: 32, default: 'active' })
  status!: TipBattleStatus;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  pot!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}

// ---