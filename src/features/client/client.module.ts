import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Client, User } from 'src/entities';
import { UsersModule } from '../modules';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User]), UsersModule],
  controllers: [ClientController],
  providers: [ClientService, AuthService, JwtService],
})
export class ClientModule {}
