import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const apiPrefix = config.get<string>('app.apiPrefix');
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  app.enableCors({
    origin: config.get<string[]>('app.corsOrigins'),
    Credential: config.get<boolean>('app.corsCredentail'),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);
  await app.listen(config.getOrThrow<number>('app.port'));
}
await bootstrap();
