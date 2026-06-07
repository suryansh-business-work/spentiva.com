import gql from 'graphql-tag';
import CategoryService from './category.services';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../config/categories';
import { requireAuth, badInput, notFound } from '../../graphql/errors';
import { resolveId } from '../../graphql/utils';
import type { GraphQLContext } from '../../graphql/context';
import type { CategoryType } from './category.models';

export const categoryTypeDefs = gql`
  enum CategoryType {
    expense
    income
    debit_mode
    credit_mode
  }

  type SubCategory {
    id: String!
    name: String!
  }

  type Category {
    id: ID!
    trackerId: String!
    name: String!
    type: CategoryType!
    subcategories: [SubCategory!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input SubCategoryInput {
    id: String!
    name: String!
  }

  input CreateCategoryInput {
    trackerId: String!
    name: String!
    type: CategoryType
    subcategories: [SubCategoryInput!]
  }

  input UpdateCategoryInput {
    name: String
    type: CategoryType
    subcategories: [SubCategoryInput!]
  }

  type CategoryConfig {
    categories: JSON!
    paymentMethods: JSON!
  }

  extend type Query {
    categories(trackerId: String, type: CategoryType): [Category!]!
    category(id: ID!): Category!
    "Static, predefined categories + payment methods (public)."
    categoryConfig: CategoryConfig!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;

interface CreateCategoryArgs {
  input: {
    trackerId: string;
    name: string;
    type?: CategoryType;
    subcategories?: Array<{ id: string; name: string }>;
  };
}

interface UpdateCategoryArgs {
  id: string;
  input: {
    name?: string;
    type?: CategoryType;
    subcategories?: Array<{ id: string; name: string }>;
  };
}

export const categoryResolvers = {
  Category: {
    id: resolveId,
  },
  Query: {
    categories: async (
      _parent: unknown,
      args: { trackerId?: string; type?: CategoryType },
      ctx: GraphQLContext
    ) => {
      requireAuth(ctx);
      return CategoryService.getAllCategories(args.trackerId, args.type);
    },
    category: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      try {
        return await CategoryService.getCategoryById(args.id);
      } catch (error) {
        throw notFound((error as Error).message);
      }
    },
    categoryConfig: () => ({
      categories: EXPENSE_CATEGORIES,
      paymentMethods: PAYMENT_METHODS,
    }),
  },
  Mutation: {
    createCategory: async (_parent: unknown, { input }: CreateCategoryArgs, ctx: GraphQLContext) => {
      requireAuth(ctx);
      if (!input.trackerId || !input.name) {
        throw badInput('Missing required fields: trackerId, name');
      }
      return CategoryService.createCategory(
        input.trackerId,
        input.name,
        input.subcategories || [],
        input.type || 'expense'
      );
    },
    updateCategory: async (_parent: unknown, { id, input }: UpdateCategoryArgs, ctx: GraphQLContext) => {
      requireAuth(ctx);
      try {
        return await CategoryService.updateCategory(id, input);
      } catch (error) {
        throw notFound((error as Error).message);
      }
    },
    deleteCategory: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      requireAuth(ctx);
      try {
        await CategoryService.deleteCategory(args.id);
        return true;
      } catch (error) {
        throw notFound((error as Error).message);
      }
    },
  },
};
