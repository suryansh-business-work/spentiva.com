import dotenv from 'dotenv';
dotenv.config();

export default {
  // Server Config
  PORT: process.env.PORT || 5002,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DBURL: process.env.DBURL || 'mongodb+srv://suryanshbusinesswork:education54@sibera-box.ofemtir.mongodb.net/spentiva?retryWrites=true&w=majority',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'spentiva-jwt-secret-key-production-2024',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:5001,https://app.spentiva.com,https://spentiva.com').split(','),
  
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // SMTP / Email Services
  SERVICES: {
    EMAIL: {
      NODEMAILER: {
        HOST: process.env.NODEMAILER_HOST || 'smtp.gmail.com',
        PORT: parseInt(process.env.NODEMAILER_PORT || '587'),
        USER: process.env.NODEMAILER_USER || 'suryansh@exyconn.com',
        PASS: process.env.NODEMAILER_PASS || 'ylip muer ugqn xvym',
      },
    },
  },
  
  // ImageKit
  IMAGEKIT: {
    PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || 'public_kgj5PULxw6pfjeO2IGwEVundBIQ=',
    PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || 'private_n4IdSlg7DbXXn88rRAVqZhCgGVw=',
    URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/esdata1'
  },
  
  // Auth Service (Shared)
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'https://auth.exyconn.com',
  AUTH_SECRET: process.env.AUTH_SECRET || 'mongodb+srv://suryanshbusinesswork:education54@sibera-box.ofemtir.mongodb.net/dynamic-auth'
};
