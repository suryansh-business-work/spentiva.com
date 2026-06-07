import type { DocumentNode } from 'graphql';
import { baseTypeDefs, baseResolvers } from './base';
import { scalarResolvers } from './scalars';
import { authTypeDefs, authResolvers } from '../apis/auth/auth.graphql';
import { categoryTypeDefs, categoryResolvers } from '../apis/category/category.graphql';
import { expenseTypeDefs, expenseResolvers } from '../apis/expense/expense.graphql';
import { trackerTypeDefs, trackerResolvers } from '../apis/tracker/tracker.graphql';
import { usageTypeDefs, usageResolvers } from '../apis/usage/usage.graphql';
import { usageLogTypeDefs, usageLogResolvers } from '../apis/usage-log/usage-log.graphql';
import { analyticsTypeDefs, analyticsResolvers } from '../apis/analytics/analytics.graphql';
import { healthTypeDefs, healthResolvers } from '../apis/health/health.graphql';
import { supportTypeDefs, supportResolvers } from '../apis/support/support.graphql';
import { paymentTypeDefs, paymentResolvers } from '../apis/payment/payment.graphql';
import { refundTypeDefs, refundResolvers } from '../apis/refund/refund.graphql';
import {
  reportScheduleTypeDefs,
  reportScheduleResolvers,
} from '../apis/report-schedule/report-schedule.graphql';

/**
 * Aggregates SDL and resolver maps from every GraphQL module. Apollo Server
 * merges arrays of typeDefs/resolvers, so each module contributes its slice
 * via `extend type Query`/`extend type Mutation`.
 *
 * Note: file uploads (imagekit/local) remain REST endpoints — multipart/binary
 * transfer is intentionally kept off the GraphQL surface.
 */
export const typeDefs: DocumentNode[] = [
  baseTypeDefs,
  authTypeDefs,
  categoryTypeDefs,
  expenseTypeDefs,
  trackerTypeDefs,
  usageTypeDefs,
  usageLogTypeDefs,
  analyticsTypeDefs,
  healthTypeDefs,
  supportTypeDefs,
  paymentTypeDefs,
  refundTypeDefs,
  reportScheduleTypeDefs,
];

export const resolvers: any[] = [
  { ...scalarResolvers, ...baseResolvers },
  authResolvers,
  categoryResolvers,
  expenseResolvers,
  trackerResolvers,
  usageResolvers,
  usageLogResolvers,
  analyticsResolvers,
  healthResolvers,
  supportResolvers,
  paymentResolvers,
  refundResolvers,
  reportScheduleResolvers,
];
