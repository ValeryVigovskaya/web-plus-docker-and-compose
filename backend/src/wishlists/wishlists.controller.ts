import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(201)
  create(@Body() data: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(data, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.wishlistsService.update(id, updateWishlistDto, userId);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.wishlistsService.remove(id, userId);
  }
}
