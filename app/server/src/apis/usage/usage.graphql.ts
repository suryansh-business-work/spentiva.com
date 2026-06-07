import gql from 'graphql-tag';
import UsageService from './usage.services';
import { requireAuth, notFound } from '../../graphql/errors';
import type { GraphQLContext } from '../../graphql/context';

export const usageTypeDefs = gql`
  extend type Query {
    "Overall usage statistics for the authenticated user."
    usageOverview: JSON!
    "Overall usage graphs (last 30 days)."
    usageOverallGraphs: JSON!
    "Usage statistics for a specific tracker."
    trackerUsageStats(trackerId: ID!): JSON!
    "Usage graphs for a specific tracker."
    trackerUsageGraphs(trackerId: ID!): JSON!
    "Paginated AI message logs for a specific tracker."
    trackerUsageLogs(trackerId: ID!, limit: Int, offset: Int): JSON!
  }
`;

export const usageResolvers = {
  Query: {
    usageOverview: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return UsageService.getOverallUsage(auth.id);
    },
    usageOverallGraphs: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return UsageService.getOverallGraphs(auth.id);
    },
    trackerUsageStats: async (_parent: unknown, args: { trackerId: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        return await UsageService.getTrackerUsage(auth.id, args.trackerId);
      } catch (error) {
        throw notFound((error as Error).message);
      }
    },
    trackerUsageGraphs: (_parent: unknown, args: { trackerId: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return UsageService.getTrackerGraphs(auth.id, args.trackerId);
    },
    trackerUsageLogs: (
      _parent: unknown,
      args: { trackerId: string; limit?: number; offset?: number },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      return UsageService.getTrackerLogs(auth.id, args.trackerId, args.limit ?? 100, args.offset ?? 0);
    },
  },
};
