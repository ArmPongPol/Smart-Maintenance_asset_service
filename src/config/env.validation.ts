import * as Joi from 'joi';
import { NodeEnv } from '../common/constants/enum.js';

const booleanString = () => Joi.boolean().sensitive();

export const envValidationSchema = Joi.object({
  // app
  NODE_ENV: Joi.string()
    .valid(...Object.values(NodeEnv))
    .default(NodeEnv.DEVELOPMENT),
  APP_NAME: Joi.string().allow(''),
  PORT: Joi.number().port(),
  API_PREFIX: Joi.string().allow(''),
  API_VERSION: Joi.string().allow(''),
  CORS_ORIGINS: Joi.string().allow(''),
  CORS_CREDENTIALS: booleanString(),

  // databaes
  HOST: Joi.string().hostname().required(),
  DATABASE_PORT: Joi.number().port(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DATABASE: Joi.string().required(),
  DATABASE_SYNCHRONIZE: booleanString().when('NODE_ENV', {
    is: NodeEnv.PRODUCTION,
    then: Joi.valid(false).messages({
      'any.only':
        'DATABASE_SYNCHRONIZE must never be enabled in production. Use migrations',
    }),
  }),
  DB_LOGGING: booleanString(),
  DATABASE_SSL: booleanString(),
  DATABASE_SSL_REJECT_UNAUTHORIZED: booleanString(),

  // docs
  DOCS_ENABLED: booleanString(),
  DOCS_PATH: Joi.string().allow(''),
  DOCS_DESCRIPTION: Joi.string().allow(''),
});
