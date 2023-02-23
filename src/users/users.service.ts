import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user';
import { CreateUserDetails } from './types/user';

export type CustomUser = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'sarzeez',
      password: '123456',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findOne(username: string): Promise<CustomUser | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async createUser(userDetails: CreateUserDetails): Promise<void> {
    const user = this.userRepository.create({ ...userDetails, createdAt: new Date() });
    await this.userRepository.save(user);
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }
}
