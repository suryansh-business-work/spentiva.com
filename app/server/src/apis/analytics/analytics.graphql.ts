import gql from 'graphql-tag';
import AnalyticsService from './analytics.services';
import { requireAuth } from '../../graphql/errors';
import type { GraphQLContext } from '../../graphql/context';
import type { AnalyticsQueryDto } from './analytics.validators';

export const analyticsTypeDefs = gql`
  input AnalyticsInput {
    "One of: today, yesterday, last_7_days, this_month, last_month, this_year, custom"
    filter: String
    customStart: String
    customEnd: String
    trackerId: String
    categoryId: String
    "One of: all, expense, income"
    type: String
    year: Int
  }

  extend type Query {
    analyticsSummary(input: AnalyticsInput): JSON!
    analyticsByCategory(input: AnalyticsInput): JSON!
    analyticsByMonth(input: AnalyticsInput): JSON!
    analyticsBySource(input: AnalyticsInput): JSON!
    analyticsTotal(input: AnalyticsInput): JSON!
  }
`;

type AnalyticsArgs = { input?: Partial<AnalyticsQueryDto> };
const asQuery = (input?: Partial<AnalyticsQueryDto>): AnalyticsQueryDto =>
  (input ?? {}) as AnalyticsQueryDto;

export const analyticsResolvers = {
  Query: {
    analyticsSummary: (_p: unknown, { input }: AnalyticsArgs, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return AnalyticsService.getSummaryStats(asQuery(input));
    },
    analyticsByCategory: (_p: unknown, { input }: AnalyticsArgs, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return AnalyticsService.getExpensesByCategory(asQuery(input));
    },
    analyticsByMonth: (_p: unknown, { input }: AnalyticsArgs, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return AnalyticsService.getExpensesByMonth(asQuery(input));
    },
    analyticsBySource: (_p: unknown, { input }: AnalyticsArgs, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return AnalyticsService.getExpensesBySource(asQuery(input));
    },
    analyticsTotal: (_p: unknown, { input }: AnalyticsArgs, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return AnalyticsService.getTotalExpenses(asQuery(input));
    },
  },
};
