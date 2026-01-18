/* eslint-disable @typescript-eslint/no-require-imports */
import 'reflect-metadata';
import dotenv from 'dotenv';

// CRITICAL: Load .env variables BEFORE importing any modules that use process.env
dotenv.config();

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import db from './config/db';
import config from './config/env';
import swaggerSpec from './swagger/config';
import { logger } from './utils/logger';
import { requestLogger } from './middleware/request-logger';
import { apiLimiter, authLimiter, otpLimiter, aiLimiter } from './middleware/rate-limit';

// Modular API Routes
// Auth is now handled by external server (auth.spentiva.com)
import trackerRoutes from './apis/tracker/tracker.routes';
import categoryRoutes from './apis/category/category.routes';
import expenseRoutes from './apis/expense/expense.routes';
import usageRoutes from './apis/usage/usage.routes';
import usageLogRoutes from './apis/usage-log/usage-log.routes';
import imagekitUploadRoutes from './apis/file-upload/imagekit-file-upload/imagekit.routes';
import uploadRoutes from './apis/file-upload/local-upload/upload.routes';
import supportRoutes from './apis/support/support.routes';
import analyticsRoutes from './apis/analytics/analytics.routes';
// Admin module removed - user management is now handled by external auth server
import healthRoutes from './apis/health/health.routes';
import paymentRoutes from './apis/payment/payment.routes';
import refundRoutes from './apis/refund/refund.routes';

const app = express();
const PORT = config.PORT;

// Initialize database connection
db(config.DBURL);

// === Security Middleware ===
// Helmet - Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for Swagger UI
    crossOriginEmbedderPolicy: false,
  })
);

// CORS Configuration
const allowedOrigins = [
  'https://app.spentiva.com',
  'http://localhost:8001',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8082',
  'http://localhost:5001',
  'http://10.0.2.2',
  '10.0.2.2',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // If allowedOrigins contains * or the origin itself, allow it
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        logger.warn('CORS blocked origin', { origin });
        callback(null, false);
      }
    },
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-api-key'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
  })
);

// Enable gzip compression for all responses
app.use(compression());

// Request logging middleware
app.use(requestLogger);

// Body parser with increased limits for file uploads (especially base64 images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// === Swagger API Documentation ===
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Spentiva API Docs',
    customfavIcon: '/favicon.ico',
  })
);

// === Modular API Routes ===

// Health & Monitoring (no rate limiting)
app.use('/v1/api', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  const { successResponse } = require('./utils/response-object');
  return successResponse(
    res,
    { server: 'Spentiva', version: '1.0.0' },
    'Spentiva Server is running'
  );
});

// Auth is now handled by external server (auth.spentiva.com)
// All authentication routes have been removed

// AI Endpoints (with moderate rate limiting)
app.use('/v1/api/expense/parse', aiLimiter);

// Resource Routes (BEFORE general rate limiting)
app.use('/v1/api/category', categoryRoutes);
app.use('/v1/api/expense', expenseRoutes);
app.use('/v1/api/tracker', trackerRoutes);
app.use('/v1/api/usage', usageRoutes);
app.use('/v1/api/usage-logs', usageLogRoutes);

// File uploads
app.use('/v1/api', imagekitUploadRoutes);
app.use('/v1/api', uploadRoutes);

// Analytics
app.use('/v1/api/analytics', analyticsRoutes);

// Admin Panel - Removed (user management is now handled by external auth server)
// app.use('/v1/api/admin', adminRoutes);

// Support Tickets
app.use('/v1/api/support', supportRoutes);

// Payment & Refund
app.use('/v1/api/payment', paymentRoutes);
app.use('/v1/api/refund', refundRoutes);

// General API rate limiting (AFTER all specific routes)
// This will only apply to routes not matched above
app.use('/v1/api', apiLimiter);

// Global Error Handler (must be after all routes)
app.use((err: any, _req: any, res: any, _next: any) => {
  // Handle JSON parse errors
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    logger.error('Bad JSON payload', { error: err.message });
    const { badRequestResponse } = require('./utils/response-object');
    return badRequestResponse(res, null, 'Invalid JSON payload provided');
  }

  logger.error('Global error handler', { error: err.message, stack: err.stack });
  const { errorResponse } = require('./utils/response-object');
  return errorResponse(res, err, 'Internal server error');
});

app.listen(PORT, () => {
  logger.info('🚀 Spentiva Server Started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
  });
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/v1/api/health\n`);
});
