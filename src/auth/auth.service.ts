import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/users/types/user';
import { UsersService } from 'src/users/users.service';
import { comparePasswords } from 'src/uitls/bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}
  async validateUser(email: string, pass: string): Promise<JwtPayload> {
    const userDB = await this.usersService.findUserByEmail(email);
    if (!userDB.isActive || userDB.isDeleted) {
      return null;
    }
    if (userDB && comparePasswords(pass, userDB.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, createdAt, ...result } = userDB;
      return result;
    }
    return null;
  }

  async login(user: JwtPayload) {
    const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
