import { GraphQLError } from 'graphql';
import type { ZodSchema } from 'zod';
import type { AuthContextUser, GraphQLContext } from './context';

/** Standardised GraphQL errors with stable extension codes for clients. */
export const unauthenticated = (message = 'Authentication required'): GraphQLError =>
  new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } } });

export const forbidden = (message = 'You do not have permission to perform this action'): GraphQLError =>
  new GraphQLError(message, { extensions: { code: 'FORBIDDEN', http: { status: 403 } } });

export const badInput = (message: string, details?: unknown): GraphQLError =>
  new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT', details } });

export const notFound = (message = 'Resource not found'): GraphQLError =>
  new GraphQLError(message, { extensions: { code: 'NOT_FOUND', http: { status: 404 } } });

/** Throws UNAUTHENTICATED unless a user is present on the context. */
export const requireAuth = (ctx: GraphQLContext): AuthContextUser => {
  if (!ctx.user) throw unauthenticated();
  return ctx.user;
};

/** Throws unless the context user has the admin role. */
export const requireAdmin = (ctx: GraphQLContext): AuthContextUser => {
  const user = requireAuth(ctx);
  if (user.role !== 'admin') throw forbidden();
  return user;
};

/**
 * Validates `input` against a Zod schema, throwing BAD_USER_INPUT with the
 * first message on failure. Reuses the same schemas as the REST controllers.
 */
export const validate = <T>(schema: ZodSchema<T>, input: unknown): T => {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || 'Validation failed';
    throw badInput(firstError, parsed.error.errors);
  }
  return parsed.data;
};
