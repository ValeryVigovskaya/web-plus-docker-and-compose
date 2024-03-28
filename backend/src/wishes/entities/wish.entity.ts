import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsNotEmpty, Length, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { BaseEntity } from 'src/entities/base.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column('varchar', { nullable: false })
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @Column('varchar')
  @IsUrl()
  link: string;

  @Column('varchar')
  @IsUrl()
  image: string;

  @Column('decimal', { scale: 2 })
  price: number;

  @Column('decimal', { scale: 2, nullable: true, default: 0 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column('varchar', { nullable: true })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  @JoinTable()
  wishlists: Wishlist[];

  @Column('int', { default: 0 })
  copied: number;
}
