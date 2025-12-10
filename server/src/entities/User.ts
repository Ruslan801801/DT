import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity({ name: 'users' })
export class User {
@PrimaryGeneratedColumn('uuid')
id!: string;

@Index({ unique: true })
@Column({ type: 'varchar', length: 255 })
phone!: string;

@Column({ type: 'varchar', length: 255, nullable: true })
display_name!: string | null;

@CreateDateColumn({ type: 'timestamptz' })
created_at!: Date;

@UpdateDateColumn({ type: 'timestamptz' })
updated_at!: Date;
}