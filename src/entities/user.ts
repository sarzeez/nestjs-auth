import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ConfirmationPurpose {
  DEFAULT = '',
  EMAIL_CONFIRMATION = 'email_confirmation',
  RESET_PASSWORD_CONFIRMATION = 'reset_password_confirmation',
}

@Entity()
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

  @Column()
  createdAt: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ConfirmationPurpose,
    default: ConfirmationPurpose.DEFAULT,
  })
  confirmationPurpose: ConfirmationPurpose;

  @Column()
  confirmationToken: string;

  @Column({ default: false })
  isDeleted: boolean;
}
