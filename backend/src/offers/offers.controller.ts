import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post()
  create(@Req() req, @Body() offer: CreateOfferDto) {
    return this.offersService.create(req.user.id, offer);
  }
  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.offersService.findAll();
  }
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
  //   return this.offersService.update(+id, updateOfferDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.offersService.remove(+id);
  // }
}
