import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedExceptionCustom extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
