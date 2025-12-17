import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'tip_battle_participants' })
export class TipBattleParticipant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  battle_id!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  user_id!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  score!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  joined_at!: Date;
}

// ---