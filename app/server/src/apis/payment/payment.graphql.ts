import gql from 'graphql-tag';
import PaymentService from './payment.services';
import { requireAuth, notFound } from '../../graphql/errors';
import type { GraphQLContext } from '../../graphql/context';

type CreatePaymentInput = Parameters<typeof PaymentService.createPayment>[0];
type PaymentStateArg = Parameters<typeof PaymentService.updatePaymentState>[1];
type UserPaymentFilters = NonNullable<Parameters<typeof PaymentService.getUserPayments>[1]>;
type AllPaymentFilters = NonNullable<Parameters<typeof PaymentService.getAllPayments>[0]>;

export const paymentTypeDefs = gql`
  extend type Query {
    payment(paymentId: ID!): JSON
    userPayments(userId: ID!, state: String, planType: String, limit: Int): JSON!
    payments(state: String, planType: String, limit: Int, skip: Int): JSON!
    paymentStats: JSON!
  }

  extend type Mutation {
    createPayment(input: JSON!): JSON!
    updatePaymentState(paymentId: ID!, state: String!, reason: String!): JSON
    deletePayment(paymentId: ID!): Boolean!
    expirePendingPayments(expiryMinutes: Int): Int!
  }
`;

export const paymentResolvers = {
  Query: {
    payment: async (_p: unknown, args: { paymentId: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      const payment = await PaymentService.getPaymentById(args.paymentId);
      if (!payment) throw notFound('Payment not found');
      return payment;
    },
    userPayments: (
      _p: unknown,
      args: { userId: string; state?: string; planType?: string; limit?: number },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      return PaymentService.getUserPayments(args.userId, {
        state: args.state,
        planType: args.planType,
        limit: args.limit,
      } as UserPaymentFilters);
    },
    payments: (
      _p: unknown,
      args: { state?: string; planType?: string; limit?: number; skip?: number },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      return PaymentService.getAllPayments(args as AllPaymentFilters);
    },
    paymentStats: (_p: unknown, _args: unknown, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return PaymentService.getPaymentStats({ userId: auth.id });
    },
  },
  Mutation: {
    createPayment: (_p: unknown, args: { input: Record<string, unknown> }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return PaymentService.createPayment({
        ...args.input,
        userId: auth.id,
      } as unknown as CreatePaymentInput);
    },
    updatePaymentState: async (
      _p: unknown,
      args: { paymentId: string; state: string; reason: string },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      const payment = await PaymentService.updatePaymentState(
        args.paymentId,
        args.state as PaymentStateArg,
        args.reason
      );
      if (!payment) throw notFound('Payment not found');
      return payment;
    },
    deletePayment: (_p: unknown, args: { paymentId: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return PaymentService.deletePayment(args.paymentId);
    },
    expirePendingPayments: (_p: unknown, args: { expiryMinutes?: number }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      return PaymentService.expirePendingPayments(args.expiryMinutes ?? 30);
    },
  },
};
