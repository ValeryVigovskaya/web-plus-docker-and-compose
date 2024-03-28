import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  @IsOptional()
  username: string;

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  password: string;
}
