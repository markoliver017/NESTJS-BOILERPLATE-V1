import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  APP_URL: Joi.string().required(),
  ENVIRONMENT: Joi.string().required(),
  PORT: Joi.number().required(),

  // Database Connection
  DATABASE_URL: Joi.string().required(),

  // DB
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  // BETTER-AUTH
  BETTER_AUTH_URL: Joi.string().required(),
  BETTER_AUTH_SECRET: Joi.string().required(),
  // SMTP
  SMTP_SERVICE: Joi.string().required(),
  SMTP_SECURE: Joi.boolean().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_FROM_NAME: Joi.string().required(),
  SMTP_FROM_EMAIL: Joi.string().email().required(),
});
