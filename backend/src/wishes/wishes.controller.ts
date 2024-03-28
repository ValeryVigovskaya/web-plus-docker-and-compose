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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('last')
  findLastWishes(): Promise<Wish[]> {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  findTopWishes(): Promise<Wish[]> {
    return this.wishesService.findTopWishes();
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.wishesService.findOne(+id);
  // }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.wishesService.update(id, updateWishDto, userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findWishById(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.wishesService.copyWishById(id, userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.wishesService.remove(id, userId);
  }
}
