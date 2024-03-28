import {
  Entity,
  Column,
  OneToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import {
  IsNotEmpty,
  Length,
  IsUrl,
  IsEmail,
  IsString,
  IsOptional,
} from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { BaseEntity } from 'src/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column('varchar', { unique: true })
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @Column('varchar', { default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  @IsOptional()
  about: string;

  @Column('varchar', { default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Column('varchar', { unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ select: false })
  @IsString()
  @Length(3, 20)
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  @JoinTable()
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  @JoinTable()
  wishlists: Wishlist[];

  @BeforeInsert()
  @BeforeUpdate()
  validateAbout() {
    if (!this.about) {
      this.about = 'Пока ничего не рассказал о себе';
    }
  }
}
