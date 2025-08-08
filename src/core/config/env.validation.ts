import * as Joi from 'joi';
import { Environment } from '../enums';

export const validationSchema = Joi.object({
  // Firebase
  FB_PROJECT_ID: Joi.string().required(),
  FB_DATABASE_URL: Joi.string().required(),
  FB_SERVICE_ACCOUNT: Joi.string().when('NODE_ENV', {
    is: Environment.DEV,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Logging
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug', 'trace').default('info'),
  LOG_TIMESTAMP: Joi.boolean().default(true),
  LOG_REQUEST_BODY: Joi.boolean().default(false),
  LOG_REQUEST_HEADERS: Joi.boolean().default(true),
  MASK_LOGGED_SENSITIVE_DATA: Joi.boolean().default(true),
  QUIET_REQ_LOGGER: Joi.boolean().default(true),

  // API Documentation
  SWAGGER_API_DOCS_PATH: Joi.string().default('api-docs'),
});
