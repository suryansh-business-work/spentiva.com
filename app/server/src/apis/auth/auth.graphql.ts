import gql from 'graphql-tag';
import { AuthService } from './auth.services';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from './auth.validators';
import { validate, requireAuth, badInput, notFound } from '../../graphql/errors';
import type { GraphQLContext } from '../../graphql/context';

export const authTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    profilePicture: String
    role: String!
    isVerified: Boolean!
    lastLoginAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    profilePicture: String
  }

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }

  extend type Query {
    "Returns the currently authenticated user."
    me: User!
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
    forgotPassword(input: ForgotPasswordInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Boolean!
  }
`;

type WithId = { _id?: unknown; id?: unknown };

export const authResolvers = {
  User: {
    // Mongoose plain objects expose `_id`; normalise to the GraphQL `id`.
    id: (parent: WithId) => String(parent._id ?? parent.id),
  },
  Query: {
    me: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      const user = await AuthService.getUserById(auth.id);
      if (!user) throw notFound('User not found');
      return user;
    },
  },
  Mutation: {
    register: async (_parent: unknown, { input }: { input: unknown }) => {
      const data = validate(registerSchema, input);
      try {
        return await AuthService.register(data);
      } catch (error) {
        const message = (error as Error).message;
        if (message?.includes('already exists')) throw badInput(message);
        throw error;
      }
    },
    login: async (_parent: unknown, { input }: { input: unknown }, ctx: GraphQLContext) => {
      const data = validate(loginSchema, input);
      try {
        return await AuthService.login(data.email, data.password, ctx.ip);
      } catch (error) {
        const message = (error as Error).message;
        if (message === 'Invalid email or password') throw badInput(message);
        throw error;
      }
    },
    updateProfile: async (_parent: unknown, { input }: { input: unknown }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      const data = validate(updateProfileSchema, input);
      const user = await AuthService.updateProfile(auth.id, data);
      if (!user) throw notFound('User not found');
      return user;
    },
    forgotPassword: async (_parent: unknown, { input }: { input: unknown }) => {
      const data = validate(forgotPasswordSchema, input);
      await AuthService.generateResetToken(data.email);
      // Always succeed to avoid email enumeration.
      return true;
    },
    resetPassword: async (_parent: unknown, { input }: { input: unknown }) => {
      const data = validate(resetPasswordSchema, input);
      try {
        await AuthService.resetPassword(data.token, data.password);
        return true;
      } catch (error) {
        const message = (error as Error).message;
        if (message === 'Invalid or expired reset token') throw badInput(message);
        throw error;
      }
    },
  },
};
