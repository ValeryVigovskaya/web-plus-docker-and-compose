import { IsNotEmpty, IsString } from 'class-validator';

export class SigninUserDto {
  @IsString()
  username: string;
  @IsNotEmpty()
  password: string;
}
