import { IsNotEmpty } from 'class-validator';

export class CreateUserPofileDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  birth: string;

  @IsNotEmpty()
  job: string;
}

export class UpdateUserPofileDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  birth: string;

  @IsNotEmpty()
  job: string;
}
