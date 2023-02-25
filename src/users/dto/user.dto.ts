import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  username: string;
}
