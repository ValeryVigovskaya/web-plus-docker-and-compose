import { IsString, IsUrl, IsNumber } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';

export class UserWishesDto {
  @IsNumber()
  id: number;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;

  @IsString()
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsNumber()
  raised: number;

  @IsNumber()
  copied: number;

  @IsString()
  description: string;

  offers: Offer[];
}
