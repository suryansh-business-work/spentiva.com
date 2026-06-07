import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import type { Express } from 'express';
import { typeDefs, resolvers } from './modules';
import { buildContext, type GraphQLContext } from './context';
import { logger } from '../utils/logger';
import config from '../config/config';

const isProduction = config.NODE_ENV === 'production';

/**
 * Creates the Apollo Server instance and mounts it on the Express app at
 * `/graphql`. Must be awaited before the HTTP server starts listening.
 *
 * Relies on the global `express.json()` and CORS middleware already registered
 * on the app, so it is mounted after those in the bootstrap sequence.
 */
export const setupGraphQL = async (app: Express): Promise<void> => {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    introspection: !isProduction,
    includeStacktraceInErrorResponses: !isProduction,
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => buildContext({ req }),
    })
  );

  logger.info('🔮 GraphQL endpoint ready', { path: '/graphql', introspection: !isProduction });
};
