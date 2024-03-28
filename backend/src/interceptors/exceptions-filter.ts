import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ConflictExceptionCustom } from '../errors/conflict-eception';
import { BadRequestExceptionCustom } from 'src/errors/bad-request-exception';
import { NotFoundExceptionCustom } from '../errors/not-found';
import { ForbiddenExceptionCustom } from '../errors/forbidden-eception';
import { UnauthorizedExceptionCustom } from '../errors/unauthorized-eception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Внутренняя ошибка сервера';

    if (exception instanceof ConflictExceptionCustom) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    if (exception instanceof BadRequestExceptionCustom) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    if (exception instanceof NotFoundExceptionCustom) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    if (exception instanceof ForbiddenExceptionCustom) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    if (exception instanceof UnauthorizedExceptionCustom) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
