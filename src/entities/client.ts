import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'client' })
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  birth: string;

  @Column()
  city: string;

  @Column()
  address: string;
}
