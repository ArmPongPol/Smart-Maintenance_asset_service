import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { NodeEnv } from '../common/constants/enum.js';

export function buildTypeOrmOptions(
  config: ConfigService,
): TypeOrmModuleOptions {
  const synchronize = config.get<boolean>('database.synchronize') ?? false;

  if (synchronize && config.get<string>('app.env') === NodeEnv.PRODUCTION) {
    throw new Error(
      `DATABASE_SYNCHRONIZE must never be enabled in production. Use migrations`,
    );
  }

  return {
    type: 'postgres',
    host: config.get<string>('database.host'),
    port: config.get<number>('database.port'),
    username: config.get<string>('database.username'),
    password: config.get<string>('database.password'),
    database: config.get<string>('database.database'),
    ssl: config.get<boolean>('database.ssl')
      ? {
          rejectUnauthorized:
            config.get<boolean>('database.sslRejectUnauthorized') ?? true,
        }
      : false,
    autoLoadEntities: true,
    synchronize,
    logging: config.get<boolean>('database.logging'),
    // .js only: the build also emits .d.ts files next to each migration.
    migrations: [
      join(import.meta.dirname, '..', 'database', 'migrations', '*.js'),
    ],
    migrationsRun: false,
  };
}
