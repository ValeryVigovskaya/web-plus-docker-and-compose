import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenExceptionCustom extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
