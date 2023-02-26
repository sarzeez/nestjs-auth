import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Client } from './client';

export enum ConfirmationPurpose {
  DEFAULT = '',
  EMAIL_CONFIRMATION = 'email_confirmation',
  RESET_PASSWORD_CONFIRMATION = 'reset_password_confirmation',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'admin' })
  role: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: false, name: 'is_active' })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ConfirmationPurpose,
    default: ConfirmationPurpose.DEFAULT,
    name: 'confirmation_purpose',
  })
  confirmationPurpose: ConfirmationPurpose;

  @Column({ name: 'confirmation_token' })
  confirmationToken: string;

  @Column({ default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @OneToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
