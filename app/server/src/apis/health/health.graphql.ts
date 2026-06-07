import gql from 'graphql-tag';
import mongoose from 'mongoose';
import config from '../../config/config';

export const healthTypeDefs = gql`
  extend type Query {
    "Service health including database connectivity (public)."
    health: JSON!
  }
`;

export const healthResolvers = {
  Query: {
    health: () => {
      const dbState = mongoose.connection.readyState;
      const database = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
      return {
        status: database === 'connected' ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
        version: '1.0.0',
        checks: {
          database,
          memory: {
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
          },
        },
      };
    },
  },
};
