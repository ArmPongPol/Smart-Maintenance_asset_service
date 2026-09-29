import { ConfigService } from '@nestjs/config';
import { config as loadEnv } from 'dotenv';
import appConfig from '../config/app.config.js';
import databaseConfig from '../config/database.config.js';
import { DataSource, DataSourceOptions } from 'typeorm';
import { buildTypeOrmOptions } from '../config/typeorm.config.js';
import { join } from 'path';

// Used by the TypeORM CLI (npm run migration:*), which loads the compiled
// file from dist/, so the globs below match .js files.
loadEnv({ quiet: true });

const config = new ConfigService({
  app: appConfig(),
  database: databaseConfig(),
});

export default new DataSource({
  ...(buildTypeOrmOptions(config) as DataSourceOptions),
  // autoLoadEntities only works inside Nest, so the CLI finds entities by file name.
  entities: [join(import.meta.dirname, '..', '**', '*.entity.js')],
});
