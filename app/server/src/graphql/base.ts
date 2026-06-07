import gql from 'graphql-tag';

/**
 * Root SDL: declares shared scalars and the root Query/Mutation types that
 * every module extends. Keeping a single source for the roots lets modules
 * register their fields via `extend type Query`/`extend type Mutation`.
 */
export const baseTypeDefs = gql`
  scalar DateTime
  scalar JSON

  type Query {
    """Liveness probe for the GraphQL endpoint."""
    _health: String!
  }

  type Mutation {
    _empty: Boolean
  }
`;

export const baseResolvers = {
  Query: {
    _health: () => 'ok',
  },
};
