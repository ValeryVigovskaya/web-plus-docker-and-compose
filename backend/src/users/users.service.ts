import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { FindOneOptions, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { hashPassword } from 'src/utils/bcrypt';
import { UserWishesDto } from './dto/user-wishes.dto';
import { ConflictExceptionCustom } from 'src/errors/conflict-eception';
import { NotFoundExceptionCustom } from 'src/errors/not-found';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const newHashPassword = await hashPassword(password);
    try {
      const user = await this.usersRepository.create({
        ...createUserDto,
        password: newHashPassword,
      });
      const saveUser = await this.usersRepository.save(user);
      delete saveUser.password;
      return saveUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;

        if (err.code === '23505') {
          throw new ConflictExceptionCustom(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundExceptionCustom('Запрашиваемый пользователь не найден');
    }
    return user;
  }

  async findByUsername(username: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOne(username);
    if (!user) {
      throw new NotFoundExceptionCustom('Запрашиваемый пользователь не найден');
    }
    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserPublicProfileResponseDto> {
    try {
      const userPassword = updateUserDto.password;
      const user = await this.usersRepository.findOneBy({ id });

      if (userPassword) {
        updateUserDto.password = await hashPassword(userPassword);
      }

      delete updateUserDto.password;
      return this.usersRepository.save({ ...user, ...updateUserDto });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        // ошибка не отображается на фронте, но помогает не менять
        // на уже имеющиеся данные
        if (err.code === '23505') {
          throw new ConflictExceptionCustom(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
  }
  //реализация метода поиска пользователей через массив условий
  async findMany(query: string): Promise<User[]> {
    const foundUser = await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
    if (!foundUser) {
      throw new NotFoundExceptionCustom('Запрашиваемый пользователь не найден');
    }
    return foundUser;
  }

  async findByUsernamePublic(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new NotFoundExceptionCustom('Запрашиваемый пользователь не найден');
    }
    delete user.email;
    return this.usersRepository.save(user);
  }

  async findWishesById(userId: number): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        wishes: true,
      },
    });
    delete user.email;
    await this.usersRepository.save(user);
    return user.wishes;
  }

  async findWishesOtherUsersById(username: string): Promise<UserWishesDto[]> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        wishes: true,
      },
    });

    if (!user) {
      throw new NotFoundExceptionCustom('Запрашиваемый пользователь не найден');
    }
    return user.wishes;
  }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
