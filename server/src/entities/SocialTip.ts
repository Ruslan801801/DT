import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'social_tips' })
export class SocialTip {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  transaction_id!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  sender_id!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  receiver_id!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount!: string;

  @Column({ type: 'varchar', length: 140, nullable: true })
  message!: string | null;

  @Column({ type: 'int', default: 1 })
  anonymity_level!: number; // 0 - анонимно, 1 - имя, 2 - имя+аватар

  @Column({ type: 'varchar', length: 512, nullable: true })
  media_url!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location!: string | null;

  @Column('text', { array: true, default: '{}' })
  tags!: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}

---