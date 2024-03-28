import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictExceptionCustom extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
