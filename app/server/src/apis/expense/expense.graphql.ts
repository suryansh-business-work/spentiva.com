import gql from 'graphql-tag';
import ExpenseService from './expense.services';
import { requireAuth, badInput, notFound } from '../../graphql/errors';
import { resolveId } from '../../graphql/utils';
import type { GraphQLContext } from '../../graphql/context';
import type { ChatMessage } from '../../types';

export const expenseTypeDefs = gql`
  enum TransactionType {
    expense
    income
  }

  type Expense {
    id: ID!
    type: TransactionType!
    amount: Float!
    category: String!
    subcategory: String
    categoryId: String!
    paymentMethod: String
    creditFrom: String
    currency: String
    description: String
    timestamp: DateTime!
    trackerId: String
    userId: String
    createdBy: String
    createdByName: String
    lastUpdatedBy: String
    lastUpdatedByName: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ExpensePagination {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
  }

  type ExpenseList {
    expenses: [Expense!]!
    pagination: ExpensePagination!
  }

  type ParsedExpense {
    type: TransactionType!
    amount: Float!
    category: String!
    subcategory: String
    categoryId: String!
    paymentMethod: String
    creditFrom: String
    currency: String!
    description: String
    timestamp: DateTime
  }

  type OpenAIUsage {
    prompt_tokens: Int!
    completion_tokens: Int!
    total_tokens: Int!
  }

  type ParseExpenseResult {
    expenses: [ParsedExpense!]!
    count: Int!
    usage: OpenAIUsage
  }

  type BulkDeleteResult {
    deletedCount: Int!
    message: String!
  }

  input ExpenseInput {
    type: TransactionType
    amount: Float!
    category: String!
    subcategory: String
    categoryId: String!
    paymentMethod: String
    creditFrom: String
    currency: String
    description: String
    timestamp: DateTime
  }

  input UpdateExpenseInput {
    type: TransactionType
    amount: Float
    category: String
    subcategory: String
    categoryId: String
    paymentMethod: String
    creditFrom: String
    currency: String
    description: String
    timestamp: DateTime
  }

  input ChatMessageInput {
    role: String!
    content: String!
  }

  extend type Query {
    expenses(trackerId: String, limit: Int, page: Int): ExpenseList!
    expense(id: ID!): Expense!
  }

  extend type Mutation {
    createExpenses(trackerId: String, expenses: [ExpenseInput!]!): [Expense!]!
    updateExpense(id: ID!, input: UpdateExpenseInput!): Expense!
    deleteExpense(id: ID!): Boolean!
    bulkDeleteExpenses(ids: [ID!]!): BulkDeleteResult!
    "Parse natural-language input into structured expenses (AI)."
    parseExpense(trackerId: String!, input: String!): ParseExpenseResult!
    "Conversational assistant for expense tracking (AI)."
    chat(trackerId: String, message: String!, history: [ChatMessageInput!]): String!
  }
`;

type ExpenseData = any;

export const expenseResolvers = {
  Expense: {
    id: resolveId,
  },
  Query: {
    expenses: async (
      _parent: unknown,
      args: { trackerId?: string; limit?: number; page?: number },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      const page = args.page ?? 1;
      const limit = args.limit ?? 20;
      const [expenses, total] = await Promise.all([
        ExpenseService.getAllExpenses({ trackerId: args.trackerId, userId: auth.id, limit, page }),
        ExpenseService.getExpenseCount({ trackerId: args.trackerId, userId: auth.id }),
      ]);
      return {
        expenses,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    },
    expense: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        return await ExpenseService.getExpenseById(args.id, auth.id);
      } catch (error) {
        throw notFound((error as Error).message);
      }
    },
  },
  Mutation: {
    createExpenses: async (
      _parent: unknown,
      args: { trackerId?: string; expenses: ExpenseData[] },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      return ExpenseService.createBulkExpenses(args.expenses, {
        trackerId: args.trackerId,
        userId: auth.id,
        createdBy: auth.id,
        createdByName: auth.name,
      });
    },
    updateExpense: async (
      _parent: unknown,
      args: { id: string; input: ExpenseData },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      try {
        return await ExpenseService.updateExpense(
          args.id,
          { ...args.input, lastUpdatedBy: auth.id, lastUpdatedByName: auth.name },
          auth.id
        );
      } catch (error) {
        throw notFound((error as Error).message);
      }
    },
    deleteExpense: async (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      try {
        await ExpenseService.deleteExpense(args.id, auth.id);
        return true;
      } catch (error) {
        throw notFound((error as Error).message);
      }
    },
    bulkDeleteExpenses: async (_parent: unknown, args: { ids: string[] }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return ExpenseService.bulkDeleteExpenses(args.ids, auth.id);
    },
    parseExpense: async (
      _parent: unknown,
      args: { trackerId: string; input: string },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      try {
        return await ExpenseService.parseExpenseForTracker({
          userId: auth.id,
          trackerId: args.trackerId,
          input: args.input,
        });
      } catch (error) {
        const message = (error as Error).message;
        if (message === 'Tracker not found') throw badInput(message);
        throw error;
      }
    },
    chat: async (
      _parent: unknown,
      args: { trackerId?: string; message: string; history?: ChatMessage[] },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      const { response } = await ExpenseService.chatForTracker({
        userId: auth.id,
        trackerId: args.trackerId,
        message: args.message,
        history: args.history ?? [],
      });
      return response;
    },
  },
};
