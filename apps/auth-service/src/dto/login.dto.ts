import { IsString } from '@nestjs/class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
