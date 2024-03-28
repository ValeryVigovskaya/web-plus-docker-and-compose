import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { BadRequestExceptionCustom } from 'src/errors/bad-request-exception';
import { NotFoundExceptionCustom } from 'src/errors/not-found';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(userId: number, offer: CreateOfferDto) {
    //находим нужного юзера
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        offers: true,
      },
    });
    const wish = await this.wishRepository.findOne({
      where: {
        id: offer.itemId,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (wish.owner.id === userId) {
      throw new BadRequestExceptionCustom(
        'На собственный подарок сделать оффер невоможно',
      );
    }
    if (wish.price === wish.raised) {
      throw new BadRequestExceptionCustom(
        'Необходимая сумма на подарок уже собрана',
      );
    }
    const remainder = wish.price - wish.raised;
    if (offer.amount > remainder) {
      throw new BadRequestExceptionCustom(
        'Заявка превышает необходимую сумму для данного подарка',
      );
    }

    const newOffer = await this.offerRepository.create({
      ...offer,
      user: user,
      item: wish,
      amount: offer.amount,
      hidden: offer.hidden,
    });

    wish.offers.push(newOffer);
    user.offers.push(newOffer);
    await this.wishRepository.save({
      ...wish,
      raised: (wish.raised += offer.amount),
    });
    await this.usersRepository.save(user);
    const offerSave = await this.offerRepository.save(newOffer);

    return offerSave;
  }

  async findAll(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: {
        user: true,
      },
    });
    return offers;
  }

  findOne(id: number): Promise<Offer> {
    const offer = this.offerRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        item: true,
      },
    });
    if (!offer) {
      throw new NotFoundExceptionCustom('Запрашиваемый оффер не найден');
    }

    return offer;
  }

  // update(id: number, updateOfferDto: UpdateOfferDto) {
  //   return `This action updates a #${id} offer`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} offer`;
  // }
}
