import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { comparePasswords } from 'src/utils/bcrypt';
import { UnauthorizedExceptionCustom } from 'src/errors/unauthorized-eception';
import { NotFoundExceptionCustom } from 'src/errors/not-found';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername({
      select: { username: true, password: true, id: true },
      where: { username },
    });

    if (!user) {
      throw new NotFoundExceptionCustom('Запрашиваемый пользователь не найден');
    }

    const matched = await comparePasswords(password, user.password);
    if (matched) {
      delete user.password;
      return user;
    }
    if (user.password !== password || user.username !== username) {
      throw new UnauthorizedExceptionCustom('Некорректная пара логин и пароль');
    }
    return null;
  }
}
