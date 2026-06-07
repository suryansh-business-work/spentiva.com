import gql from 'graphql-tag';
import ReportScheduleService from './report-schedule.services';
import { requireAuth, badInput, notFound } from '../../graphql/errors';
import type { GraphQLContext } from '../../graphql/context';

export const reportScheduleTypeDefs = gql`
  extend type Query {
    "All report schedules for the authenticated user."
    reportSchedules: [JSON!]!
    "Report schedule for a specific tracker (or null)."
    reportScheduleByTracker(trackerId: ID!): JSON
  }

  extend type Mutation {
    createReportSchedule(input: JSON!): JSON!
    updateReportSchedule(id: ID!, input: JSON!): JSON!
    deleteReportSchedule(id: ID!): Boolean!
  }
`;

export const reportScheduleResolvers = {
  Query: {
    reportSchedules: (_p: unknown, _args: unknown, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return ReportScheduleService.getSchedulesByUser(auth.id);
    },
    reportScheduleByTracker: (_p: unknown, args: { trackerId: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return ReportScheduleService.getScheduleByTracker(auth.id, args.trackerId);
    },
  },
  Mutation: {
    createReportSchedule: async (
      _p: unknown,
      args: { input: Record<string, unknown> },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      try {
        return await ReportScheduleService.createSchedule(auth.id, auth.email, args.input);
      } catch (error) {
        const message = (error as Error).message;
        if (message?.includes('already exists')) throw badInput(message);
        throw error;
      }
    },
    updateReportSchedule: async (
      _p: unknown,
      args: { id: string; input: Record<string, unknown> },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      try {
        return await ReportScheduleService.updateSchedule(auth.id, args.id, args.input);
      } catch (error) {
        throw notFound((error as Error).message);
      }
    },
    deleteReportSchedule: async (_p: unknown, args: { id: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        await ReportScheduleService.deleteSchedule(auth.id, args.id);
        return true;
      } catch (error) {
        throw notFound((error as Error).message);
      }
    },
  },
};
