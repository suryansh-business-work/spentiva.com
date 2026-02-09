/**
 * Centralized configuration for all server secrets and environment variables.
 * All sensitive values are loaded from environment variables with NO hardcoded fallbacks in production.
 */
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Require environment variable in production, allow fallback in development.
 */
const requireEnv = (key: string, devFallback?: string): string => {
  const value = process.env[key];
  if (value) return value;
  if (!isProduction && devFallback !== undefined) return devFallback;
  throw new Error(`Missing required environment variable: ${key}`);
};

const optionalEnv = (key: string, fallback: string): string => {
  return process.env[key] || fallback;
};

const config = {
  /** Server */
  PORT: parseInt(optionalEnv('PORT', '5002'), 10),
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),

  /** Database */
  DBURL: requireEnv('DBURL', 'mongodb://localhost:27017/spentiva'),

  /** JWT */
  JWT_SECRET: requireEnv('JWT_SECRET', 'dev-jwt-secret-change-in-production'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '7d'),

  /** CORS */
  ALLOWED_ORIGINS: optionalEnv(
    'ALLOWED_ORIGINS',
    'http://localhost:5001,https://app.spentiva.com,https://spentiva.com'
  ).split(','),

  /** App URL for email links */
  APP_URL: optionalEnv('APP_URL', 'http://localhost:5001'),

  /** OpenAI */
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  /** SMTP / Email */
  SMTP: {
    HOST: optionalEnv('NODEMAILER_HOST', 'smtp.gmail.com'),
    PORT: parseInt(optionalEnv('NODEMAILER_PORT', '587'), 10),
    USER: requireEnv('NODEMAILER_USER', 'dev@example.com'),
    PASS: requireEnv('NODEMAILER_PASS', ''),
  },

  /** ImageKit CDN */
  IMAGEKIT: {
    PUBLIC_KEY: requireEnv('IMAGEKIT_PUBLIC_KEY', ''),
    PRIVATE_KEY: requireEnv('IMAGEKIT_PRIVATE_KEY', ''),
    URL_ENDPOINT: optionalEnv('IMAGEKIT_URL_ENDPOINT', 'https://ik.imagekit.io/esdata1'),
  },

  /** External Auth Service */
  AUTH_SERVICE_URL: optionalEnv('AUTH_SERVICE_URL', 'https://auth.exyconn.com'),
  AUTH_SECRET: requireEnv('AUTH_SECRET', 'dev-auth-secret'),
} as const;

export default config;
