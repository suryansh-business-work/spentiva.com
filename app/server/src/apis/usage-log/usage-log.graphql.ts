import gql from 'graphql-tag';
import UsageLogService from './usage-log.services';
import { requireAuth } from '../../graphql/errors';
import type { GraphQLContext } from '../../graphql/context';

export const usageLogTypeDefs = gql`
  extend type Query {
    "Usage logs for the authenticated user, optionally filtered by tracker."
    usageLogs(trackerId: String, limit: Int): JSON!
  }

  extend type Mutation {
    "Delete logs older than N days (maintenance)."
    deleteOldUsageLogs(daysOld: Int): JSON!
    "Delete all usage logs for a tracker."
    deleteUsageLogsByTracker(trackerId: ID!): JSON!
    "Delete all usage logs for the authenticated user."
    deleteUsageLogsByUser: JSON!
  }
`;

export const usageLogResolvers = {
  Query: {
    usageLogs: (
      _parent: unknown,
      args: { trackerId?: string; limit?: number },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      return UsageLogService.getAllLogs({
        userId: auth.id,
        trackerId: args.trackerId,
        limit: args.limit,
      });
    },
  },
  Mutation: {
    deleteOldUsageLogs: (_parent: unknown, args: { daysOld?: number }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return UsageLogService.deleteOldLogs(args.daysOld ?? 90);
    },
    deleteUsageLogsByTracker: (
      _parent: unknown,
      args: { trackerId: string },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      return UsageLogService.deleteLogsByTracker(auth.id, args.trackerId);
    },
    deleteUsageLogsByUser: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return UsageLogService.deleteLogsByUser(auth.id);
    },
  },
};
