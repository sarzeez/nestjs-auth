import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AuthService, JwtService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
