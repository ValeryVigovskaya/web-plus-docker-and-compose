import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundExceptionCustom extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
