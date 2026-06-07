import gql from 'graphql-tag';
import TrackerService from './tracker.services';
import { requireAuth, badInput, notFound } from '../../graphql/errors';
import type { GraphQLContext } from '../../graphql/context';

export const trackerTypeDefs = gql`
  enum TrackerType {
    personal
    business
  }

  enum Currency {
    INR
    USD
    EUR
    GBP
  }

  enum SharedRole {
    viewer
    editor
  }

  enum InviteStatus {
    pending
    accepted
    rejected
  }

  enum InviteResponse {
    accepted
    rejected
  }

  type SharedUser {
    userId: String!
    email: String!
    name: String
    role: SharedRole!
    status: InviteStatus!
    invitedAt: DateTime!
  }

  type Tracker {
    id: ID!
    name: String!
    type: TrackerType!
    description: String
    currency: Currency!
    botImage: String
    isOwner: Boolean
    sharedWith: [SharedUser!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateTrackerInput {
    name: String!
    type: TrackerType!
    description: String
    currency: Currency!
  }

  input UpdateTrackerInput {
    name: String
    type: TrackerType
    description: String
    currency: Currency
    botImage: String
  }

  input ShareTrackerInput {
    email: String!
    role: SharedRole!
  }

  type ShareResult {
    sharedWith: [SharedUser!]!
  }

  type DeleteOtpResult {
    trackerName: String!
  }

  type InviteResponseResult {
    status: InviteStatus!
    trackerName: String!
    trackerId: String!
  }

  extend type Query {
    trackers: [Tracker!]!
    tracker(id: ID!): Tracker!
  }

  extend type Mutation {
    createTracker(input: CreateTrackerInput!): Tracker!
    updateTracker(id: ID!, input: UpdateTrackerInput!): Tracker!
    deleteTracker(id: ID!): Boolean!
    requestTrackerDeleteOtp(id: ID!): DeleteOtpResult!
    confirmTrackerDelete(id: ID!, otp: String!): Boolean!
    shareTracker(id: ID!, input: ShareTrackerInput!): ShareResult!
    removeSharedUser(id: ID!, email: String!): ShareResult!
    resendShareInvite(id: ID!, email: String!): Boolean!
    respondToInvite(id: ID!, response: InviteResponse!): InviteResponseResult!
  }
`;

/** Maps known service error messages to typed GraphQL errors. */
const mapTrackerError = (error: unknown): never => {
  const message = (error as Error).message || 'Internal server error';
  if (message === 'Tracker not found' || message.includes('not found')) {
    throw notFound(message);
  }
  if (
    message.includes('already') ||
    message.includes('not invited') ||
    message.includes('Invalid OTP') ||
    message.includes('OTP has expired') ||
    message.includes('No OTP requested') ||
    message.includes('Missing required fields') ||
    message.includes('Email service')
  ) {
    throw badInput(message);
  }
  throw error;
};

interface CreateTrackerArgs {
  input: { name: string; type: 'personal' | 'business'; description?: string; currency: 'INR' | 'USD' | 'EUR' | 'GBP' };
}

interface UpdateTrackerArgs {
  id: string;
  input: {
    name?: string;
    type?: 'personal' | 'business';
    description?: string;
    currency?: 'INR' | 'USD' | 'EUR' | 'GBP';
    botImage?: string;
  };
}

interface ShareTrackerArgs {
  id: string;
  input: { email: string; role: 'viewer' | 'editor' };
}

export const trackerResolvers = {
  Tracker: {
    // createTracker returns a tracker without the sharedWith list; default to [].
    sharedWith: (parent: { sharedWith?: unknown[] }) => parent.sharedWith ?? [],
  },
  Query: {
    trackers: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return TrackerService.getAllTrackers(auth.id);
    },
    tracker: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        return await TrackerService.getTrackerById(auth.id, args.id);
      } catch (error) {
        return mapTrackerError(error);
      }
    },
  },
  Mutation: {
    createTracker: async (_parent: unknown, { input }: CreateTrackerArgs, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        return await TrackerService.createTracker(auth.id, input);
      } catch (error) {
        return mapTrackerError(error);
      }
    },
    updateTracker: async (_parent: unknown, { id, input }: UpdateTrackerArgs, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        return await TrackerService.updateTracker(auth.id, id, input);
      } catch (error) {
        return mapTrackerError(error);
      }
    },
    deleteTracker: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        await TrackerService.deleteTracker(auth.id, args.id);
        return true;
      } catch (error) {
        return mapTrackerError(error);
      }
    },
    requestTrackerDeleteOtp: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        return await TrackerService.requestDeleteOtpAndEmail(auth.id, auth.email, args.id);
      } catch (error) {
        return mapTrackerError(error);
      }
    },
    confirmTrackerDelete: async (
      _parent: unknown,
      args: { id: string; otp: string },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      try {
        await TrackerService.confirmDeleteWithOtp(auth.id, args.id, args.otp.trim());
        return true;
      } catch (error) {
        return mapTrackerError(error);
      }
    },
    shareTracker: async (_parent: unknown, { id, input }: ShareTrackerArgs, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        return await TrackerService.shareTracker(auth.id, id, input);
      } catch (error) {
        return mapTrackerError(error);
      }
    },
    removeSharedUser: async (
      _parent: unknown,
      args: { id: string; email: string },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      try {
        return await TrackerService.removeSharedUser(auth.id, args.id, args.email);
      } catch (error) {
        return mapTrackerError(error);
      }
    },
    resendShareInvite: async (
      _parent: unknown,
      args: { id: string; email: string },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      try {
        await TrackerService.resendShareInvite(auth.id, args.id, args.email);
        return true;
      } catch (error) {
        return mapTrackerError(error);
      }
    },
    respondToInvite: async (
      _parent: unknown,
      args: { id: string; response: 'accepted' | 'rejected' },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      try {
        return await TrackerService.respondToInvite(auth.id, auth.email, args.id, args.response);
      } catch (error) {
        return mapTrackerError(error);
      }
    },
  },
};
