import gql from 'graphql-tag';
import RefundService from './refund.services';
import { requireAuth, badInput, notFound } from '../../graphql/errors';
import type { GraphQLContext } from '../../graphql/context';

type CreateRefundInput = Parameters<typeof RefundService.createRefund>[0];
type RefundStatusArg = Parameters<typeof RefundService.updateRefundStatus>[1];
type UserRefundFilters = NonNullable<Parameters<typeof RefundService.getUserRefunds>[1]>;
type AllRefundFilters = NonNullable<Parameters<typeof RefundService.getAllRefunds>[0]>;

export const refundTypeDefs = gql`
  extend type Query {
    refund(refundId: ID!): JSON
    refundsByPayment(paymentId: ID!): JSON!
    userRefunds(userId: ID!, status: String, limit: Int): JSON!
    refunds(status: String, limit: Int, skip: Int): JSON!
    refundStats: JSON!
  }

  extend type Mutation {
    createRefund(input: JSON!): JSON!
    updateRefundStatus(refundId: ID!, status: String!, refundDate: DateTime): JSON
    deleteRefund(refundId: ID!): Boolean!
  }
`;

const mapRefundError = (error: unknown): never => {
  const message = (error as Error).message || 'Internal server error';
  if (message.includes('not found')) throw notFound(message);
  if (message.includes('Only successful') || message.includes('already exists')) {
    throw badInput(message);
  }
  throw error;
};

export const refundResolvers = {
  Query: {
    refund: async (_p: unknown, args: { refundId: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      const refund = await RefundService.getRefundById(args.refundId);
      if (!refund) throw notFound('Refund not found');
      return refund;
    },
    refundsByPayment: (_p: unknown, args: { paymentId: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return RefundService.getRefundsByPaymentId(args.paymentId);
    },
    userRefunds: (
      _p: unknown,
      args: { userId: string; status?: string; limit?: number },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      return RefundService.getUserRefunds(args.userId, {
        status: args.status,
        limit: args.limit,
      } as UserRefundFilters);
    },
    refunds: (
      _p: unknown,
      args: { status?: string; limit?: number; skip?: number },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      return RefundService.getAllRefunds(args as AllRefundFilters);
    },
    refundStats: (_p: unknown, _args: unknown, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return RefundService.getRefundStats();
    },
  },
  Mutation: {
    createRefund: async (_p: unknown, args: { input: Record<string, unknown> }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      try {
        return await RefundService.createRefund(args.input as CreateRefundInput);
      } catch (error) {
        return mapRefundError(error);
      }
    },
    updateRefundStatus: async (
      _p: unknown,
      args: { refundId: string; status: string; refundDate?: Date },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      const refund = await RefundService.updateRefundStatus(
        args.refundId,
        args.status as RefundStatusArg,
        args.refundDate
      );
      if (!refund) throw notFound('Refund not found');
      return refund;
    },
    deleteRefund: (_p: unknown, args: { refundId: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return RefundService.deleteRefund(args.refundId);
    },
  },
};
