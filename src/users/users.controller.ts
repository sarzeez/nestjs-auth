import { Controller } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class UsersController {
  constructor(private authService: AuthService) {}
}
