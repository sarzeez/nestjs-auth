import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmationPurpose, User } from 'src/entities/user';
import { CreateUserDetails, UpdateUserDetails } from '../../types/user';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async createUser(userDetails: CreateUserDetails): Promise<void> {
    const user = this.userRepository.create({ ...userDetails, createdAt: new Date() });
    await this.userRepository.save(user);
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['client'],
    });
  }

  async activeUser(email: string): Promise<void> {
    await this.userRepository.update(
      { email },
      { isActive: true, confirmationPurpose: ConfirmationPurpose.DEFAULT, confirmationToken: '' },
    );
  }

  async updateUser(id: number, updateUserDetails: UpdateUserDetails): Promise<void> {
    await this.userRepository.update({ id }, { ...updateUserDetails });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.update({ id }, { isDeleted: true });
  }

  async deleteUserClient(id: number) {
    await this.userRepository.update({ id }, { client: null });
  }
}
