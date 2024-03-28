import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';
import { AllExceptionsFilter } from 'src/interceptors/exceptions-filter';
import { BadRequestExceptionCustom } from 'src/errors/bad-request-exception';

@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  findOne(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  @UsePipes(
    new ValidationPipe({
      errorHttpStatusCode: 400,
      exceptionFactory: () => {
        // Форматирование ошибок в нужный формат
        throw new BadRequestExceptionCustom(
          'Ошибка валидации переданных значений',
        );
      },
    }),
  )
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  findUserByUsernameOrEmail(@Body() findUsersDto: FindUserDto) {
    const query = findUsersDto.query;
    return this.usersService.findMany(query);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findUserByUsername(@Param('username') username: string) {
    return this.usersService.findByUsernamePublic(username);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  findWishes(@Req() req) {
    const userId = req.user.id;
    return this.usersService.findWishesById(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  findWishesOtherUsers(@Param('username') username: string) {
    return this.usersService.findWishesOtherUsersById(username);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
