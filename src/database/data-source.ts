import { ConfigService } from '@nestjs/config';
import { config as loadEnv } from 'dotenv';
import appConfig from '../config/app.config.js';
import databaseConfig from '../config/database.config.js';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from '../config/typeorm.config.js';
import { DataSourceOptions } from 'typeorm/browser';
import { join } from 'path';

loadEnv({ quiet: true });

const config = new ConfigService({
  app: appConfig(),
  database: databaseConfig(),
});

export default new DataSource({
  ...(buildTypeOrmOptions(config) as DataSourceOptions),
  // autoLoadEntities only works inside Nest, so the CLI finds entities by file name.
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
});
