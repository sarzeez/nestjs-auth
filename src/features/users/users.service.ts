import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmationPurpose, User } from 'src/entities/user';
import { CreateUserDetails, UpdateUserDetails } from './types/user';
import { Profile } from 'src/entities/profile';
import { CreateUserProfileDetails, UpdateUserProfileDetails } from './types/profile';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUser(userDetails: CreateUserDetails): Promise<void> {
    const user = this.userRepository.create({ ...userDetails, createdAt: new Date() });
    await this.userRepository.save(user);
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['profile'],
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

  // profile
  async createUserProfile(
    id: number,
    createUserProfileDetails: CreateUserProfileDetails,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    const newProfile = this.profileRepository.create(createUserProfileDetails);
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;
    return this.userRepository.save(user);
  }

  async updateUserProfile(
    id: number,
    updateUserProfileDetails: UpdateUserProfileDetails,
  ): Promise<void> {
    await this.profileRepository.update({ id }, { ...updateUserProfileDetails });
  }
}
