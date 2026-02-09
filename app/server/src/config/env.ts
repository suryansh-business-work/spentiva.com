/**
 * @deprecated Import from './config' instead. This file exists for backward compatibility.
 */
import config from './config';

export default {
  PORT: config.PORT,
  NODE_ENV: config.NODE_ENV,
  DBURL: config.DBURL,
  JWT_SECRET: config.JWT_SECRET,
  JWT_EXPIRES_IN: config.JWT_EXPIRES_IN,
  ALLOWED_ORIGINS: config.ALLOWED_ORIGINS,
  OPENAI_API_KEY: config.OPENAI_API_KEY,
  SERVICES: {
    EMAIL: {
      NODEMAILER: {
        HOST: config.SMTP.HOST,
        PORT: config.SMTP.PORT,
        USER: config.SMTP.USER,
        PASS: config.SMTP.PASS,
      },
    },
  },
  IMAGEKIT: config.IMAGEKIT,
  AUTH_SERVICE_URL: config.AUTH_SERVICE_URL,
  AUTH_SECRET: config.AUTH_SECRET,
};

