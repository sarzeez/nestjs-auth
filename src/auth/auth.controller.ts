import { Controller, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  @UsePipes(new ValidationPipe())
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
