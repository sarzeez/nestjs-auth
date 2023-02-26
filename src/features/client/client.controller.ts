import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ClientDto } from 'src/dtos/client.dto';
import { JwtPayload } from 'src/types/user';
import { UsersService } from '../users/users.service';
import { ClientService } from './client.service';

@Controller('user/client')
export class ClientController {
  constructor(private userService: UsersService, private clientService: ClientService) {}

  @Get()
  async getClient(@Request() req) {
    const jwtPayload: JwtPayload = req.user;
    const user = await this.userService.findUserByEmail(jwtPayload.email);
    if (!user.client) {
      throw new ForbiddenException();
    }
    return this.clientService.getClient(user.id);
  }

  @Post()
  async createClient(@Request() req, @Body() clientDto: ClientDto) {
    const jwtPayload: JwtPayload = req.user;
    const user = await this.userService.findUserByEmail(jwtPayload.email);
    if (user.client) {
      throw new ForbiddenException();
    }
    return await this.clientService.createClient(user.id, clientDto);
  }

  @Put()
  async updateClient(@Request() req, @Body() clientDto: ClientDto) {
    const jwtPayload: JwtPayload = req.user;
    const user = await this.userService.findUserByEmail(jwtPayload.email);
    if (!user.client) {
      throw new ForbiddenException();
    }
    await this.clientService.updateClient(user.id, clientDto);
  }

  @Delete()
  async deleteClient(@Request() req) {
    const jwtPayload: JwtPayload = req.user;
    const { id, email } = jwtPayload;
    const user = await this.userService.findUserByEmail(email);
    if (!user.client.id) {
      throw new ForbiddenException();
    }
    await this.userService.deleteUserClient(id);
    await this.clientService.deleteClient(user.id);
  }
}
