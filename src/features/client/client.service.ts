import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientDto } from 'src/dtos/client.dto';
import { Client, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  async getClient(userId: number): Promise<Client> {
    return await this.clientRepository.findOneBy({ userId });
  }

  async createClient(userId: number, createClientDetails: ClientDto): Promise<Client> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const client = this.clientRepository.create({ ...createClientDetails, userId });
    const savedClient = await this.clientRepository.save(client);
    user.client = savedClient;
    await this.userRepository.save(user);
    return savedClient;
  }

  async updateClient(userId: number, updateClientDetails: ClientDto) {
    await this.clientRepository.update({ userId }, { ...updateClientDetails });
  }

  async deleteClient(userId: number) {
    await this.clientRepository.delete({ userId });
  }
}
