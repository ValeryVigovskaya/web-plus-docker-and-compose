import { IsBoolean, IsNumber } from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToOne, JoinTable } from 'typeorm';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  @JoinTable()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @JoinTable()
  item: Wish;

  @Column('decimal', { scale: 2 })
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
