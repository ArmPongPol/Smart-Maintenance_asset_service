import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getRequestId } from '../middleware/request-id.middleware.js';
import { StandardResponse } from '../interfaces/standard-response.interface.js';

const INTERNAL_ERROR_MESSAGE = 'Internal server error';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');

  catch(exception: T, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const { method, originalUrl } = request;
    const requestId = getRequestId(request) ?? '-';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.getMessage(exception);

    const line = `[${requestId}] ${method} ${originalUrl} ${status} - ${message}`;
    if (status >= 500) {
      this.logger.error(
        line,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(line);
    }

    const body: StandardResponse<null> = { status, message, data: null };
    response.status(status).json(body);
  }

  private getMessage(exception: unknown): string {
    if (!(exception instanceof HttpException)) {
      return INTERNAL_ERROR_MESSAGE;
    }

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    const { message } = exceptionResponse as { message?: string | string[] };
    if (Array.isArray(message)) {
      return message.join(', ');
    }

    return message ?? exception.message;
  }
}
