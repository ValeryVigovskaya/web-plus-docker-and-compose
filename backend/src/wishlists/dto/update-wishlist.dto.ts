import { IsArray, IsString, IsUrl } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  name: string;
  @IsUrl()
  image: string;
  @IsArray()
  itemsId: number[];
}
