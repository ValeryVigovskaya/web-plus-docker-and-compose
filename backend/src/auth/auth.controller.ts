import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * Стратегия local автоматически достанет username и password из тела запроса
   * Если пароль будет верным, данные пользователя окажутся в объекте req.user
   */
  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    /* Генерируем для пользователя JWT-токен */
    return this.authService.auth(req.user);
  }

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    /* При регистрации создаём пользователя и генерируем для него токен */
    const user = await this.usersService.signup(createUserDto);
    return user;
  }
}
