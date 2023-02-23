import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }

  @Post()
  @Public()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      throw new BadRequestException('Email is already exist');
    }
    await this.userService.createUser(createUserDto);
    return;
  }
}
