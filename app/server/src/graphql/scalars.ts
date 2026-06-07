import { DateTimeResolver, JSONResolver } from 'graphql-scalars';

/** Custom scalar resolvers shared across all GraphQL modules. */
export const scalarResolvers = {
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
};
