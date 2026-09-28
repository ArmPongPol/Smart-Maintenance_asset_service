import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { StandardResponse } from '../interfaces/standard-response.interface.js';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator.js';

const DEFAULT_MESSAGE = 'Success';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T> | T
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T> | T> {
    const targets = [context.getHandler(), context.getClass()];

    const response = context.switchToHttp().getResponse<Response>();
    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, targets) ??
      DEFAULT_MESSAGE;

    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) {
          return data;
        }

        return {
          status: response.statusCode,
          message,
          data: data ?? null,
        };
      }),
    );
  }
}
