import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { requestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { setupSwagger } from './config/swagger.config.js';

// Shared by main.ts and the e2e tests, so tests run against the same pipeline.
export function configureApp(app: INestApplication): void {
  const config = app.get(ConfigService);

  // Registered before init(), so it runs ahead of Nest's body parser and
  // requests rejected by the parser still get an id.
  app.use(requestIdMiddleware);

  const apiPrefix = config.get<string>('app.apiPrefix');
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix, { exclude: ['health'] });
  }

  const apiVersion = config.get<string>('app.apiVersion');
  if (apiVersion) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: apiVersion,
    });
  }

  app.enableCors({
    origin: config.get<string[]>('app.corsOrigins'),
    credentials: config.get<boolean>('app.corsCredential'),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(app.get(Reflector)),
  );

  app.enableShutdownHooks();
  setupSwagger(app);
}
