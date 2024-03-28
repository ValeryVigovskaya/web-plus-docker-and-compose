import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotFoundExceptionCustom } from 'src/errors/not-found';
import { ForbiddenExceptionCustom } from 'src/errors/forbidden-eception';
import { BadRequestExceptionCustom } from 'src/errors/bad-request-exception';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto, id: number): Promise<Wish> {
    //находим нужного юзера
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        wishes: true,
      },
    });

    //создаем подарок с добавлением значения юзера
    const wish = await this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });
    user.wishes.push(wish);
    //с объявлением константы подарок не сразу отображался на фронте
    await this.usersRepository.save(user);
    return this.wishRepository.save(wish);
  }

  async findLastWishes(): Promise<Wish[]> {
    const sortWishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: 0,
      take: 40,
    });

    const wishesWithoutEmail = await sortWishes.map((item) => {
      delete item.owner.email;
      return item;
    });
    return wishesWithoutEmail;
  }

  async findTopWishes(): Promise<Wish[]> {
    const sortWishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        copied: 'DESC',
      },
      skip: 0,
      take: 20,
    });
    const wishesWithoutEmail = await sortWishes.map((item) => {
      delete item.owner.email;
      return item;
    });
    return wishesWithoutEmail;
  }

  async findWishById(id: number): Promise<Wish | undefined> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (!wish) {
      throw new Error('Запрашиваемый подарок не найден');
    }
    delete wish.owner.email;
    return wish;
  }

  findAll() {
    return `This action returns all wishes`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} wish`;
  // }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
      },
    });
    if (!wish || !wish.owner) {
      throw new NotFoundExceptionCustom(
        'Запрашиваемый подарок или его владелец не найден',
      );
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenExceptionCustom(
        'Запрашиваемый подарок создан другим пользователем',
      );
    }
    if (wish.raised > 0) {
      throw new BadRequestExceptionCustom(
        'На подарок уже есть желающие скинуться, изменить стоимость не получится',
      );
    }

    const newWish = this.wishRepository.save({
      ...wish,
      ...updateWishDto,
    });
    return newWish;
  }

  async copyWishById(id: number, userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const wish = await this.wishRepository.findOne({ where: { id: id } });

    if (!user || !wish) {
      throw new NotFoundExceptionCustom(
        'Запрашиваемый пользователь или подарок не найден',
      );
    }

    // Создаем копию подарка
    const copiedWish = this.create(
      {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        description: wish.description,
        price: wish.price,
      },
      user.id,
    );
    //сохраняем у владельца оригинал
    await this.wishRepository.save({
      ...wish,
      copied: wish.copied++,
    });
    return copiedWish;
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: {
        owner: true,
        offers: true,
        wishlists: true,
      },
    });
    if (!wish) {
      throw new NotFoundExceptionCustom('Запрашиваемый подарок не найден');
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenExceptionCustom(
        'Запрашиваемый подарок создан другим пользователем',
      );
    }

    return this.wishRepository.remove(wish);
  }
}
