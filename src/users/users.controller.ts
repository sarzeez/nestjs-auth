import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { pick } from 'lodash';
import { Public } from 'src/auth/public.decorator';
import { ConfirmationPurpose } from 'src/entities/user';
import { encryptPassword } from 'src/uitls/bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtPayload } from './types/user';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me')
  async getMe(@Request() req) {
    const user: JwtPayload = req.user;
    const userDB = await this.userService.findUserByEmail(user.email);
    const result = pick(userDB, ['id', 'username', 'email', 'role', 'createdAt', 'isActive']);
    return result;
  }

  @Post()
  @Public()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      throw new BadRequestException('Email is already exist');
    }
    const emailConfirmationToken = new JwtService({
      secret: process.env.JWT_SECRET_KEY,
    }).sign(
      {
        username: createUserDto.username,
        email: createUserDto.email,
      },
      { expiresIn: '30d' },
    );
    const hashedPassword = encryptPassword(password);
    await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
      confirmationPurpose: ConfirmationPurpose.EMAIL_CONFIRMATION,
      confirmationToken: emailConfirmationToken,
    });
    return;
  }

  @Put()
  @UsePipes(new ValidationPipe())
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const { username } = updateUserDto;
    const jwtPayload = req.user;
    const user = await this.userService.findUserByEmail(jwtPayload.email);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    if (user.isDeleted) {
      throw new NotFoundException('User is not found');
    }

    await this.userService.updateUser(jwtPayload.id, { username });
  }

  @Put('confirm')
  @Public()
  async activateUser(@Request() reqeust: Request) {
    const authorization = reqeust.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('Token is not provided');
    }
    const token = authorization?.split('Bearer ')[1];
    if (!token) {
      throw new BadRequestException('Token is not valid');
    }

    let jwtPayload: JwtPayload | undefined;
    try {
      jwtPayload = new JwtService({ secret: process.env.JWT_SECRET_KEY }).verify(token);
    } catch (error) {
      throw new BadRequestException('Token is not valid');
    }

    const { email } = jwtPayload;
    const userDB = await this.userService.findUserByEmail(email);
    if (userDB.isActive) {
      throw new ForbiddenException();
    }
    await this.userService.activeUser(email);
  }

  @Delete()
  @UsePipes(new ValidationPipe())
  async deleteUser(@Request() req) {
    const jwtPayload: JwtPayload = req.user;
    await this.userService.deleteUser(jwtPayload.id);
  }
}
