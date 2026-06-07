import gql from 'graphql-tag';
import SupportService from './support.service';
import { requireAuth, requireAdmin, notFound } from '../../graphql/errors';
import type { GraphQLContext } from '../../graphql/context';

type CreateTicketType = Parameters<typeof SupportService.createTicket>[1];
type TicketStatusArg = Parameters<typeof SupportService.updateTicketStatus>[2];
type AttachmentArg = Parameters<typeof SupportService.addAttachment>[2];
type AddedByArg = Parameters<typeof SupportService.addUpdate>[3];

export const supportTypeDefs = gql`
  extend type Query {
    "Tickets for the user (or all tickets for admins)."
    supportTickets(status: String, type: String, limit: Int, skip: Int): JSON!
    supportTicket(ticketId: ID!): JSON
    supportTicketStats: JSON!
  }

  extend type Mutation {
    createSupportTicket(type: String!, subject: String!, description: String!, attachments: JSON): JSON!
    updateSupportTicketStatus(ticketId: ID!, status: String!): JSON
    addSupportTicketAttachment(ticketId: ID!, attachment: JSON!): JSON
    addSupportTicketUpdate(ticketId: ID!, message: String!, addedBy: String): JSON
    deleteSupportTicket(ticketId: ID!): Boolean!
  }
`;

export const supportResolvers = {
  Query: {
    supportTickets: (
      _p: unknown,
      args: { status?: string; type?: string; limit?: number; skip?: number },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      const status = args.status as TicketStatusArg | undefined;
      const type = args.type as CreateTicketType | undefined;
      return auth.role === 'admin'
        ? SupportService.getAllTickets(status, type, args.limit, args.skip)
        : SupportService.getUserTickets(auth.id, status, type, args.limit, args.skip);
    },
    supportTicket: (_p: unknown, args: { ticketId: string }, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return SupportService.getTicketById(args.ticketId, auth.role === 'admin' ? undefined : auth.id);
    },
    supportTicketStats: (_p: unknown, _args: unknown, ctx: GraphQLContext) => {
      const auth = requireAuth(ctx);
      return SupportService.getTicketStats(auth.role === 'admin' ? undefined : auth.id);
    },
  },
  Mutation: {
    createSupportTicket: (
      _p: unknown,
      args: { type: string; subject: string; description: string; attachments?: AttachmentArg[] },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      return SupportService.createTicket(
        auth.id,
        args.type as CreateTicketType,
        args.subject,
        args.description,
        args.attachments
      );
    },
    updateSupportTicketStatus: async (
      _p: unknown,
      args: { ticketId: string; status: string },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      const ticket = await SupportService.updateTicketStatus(
        args.ticketId,
        auth.id,
        args.status as TicketStatusArg
      );
      if (!ticket) throw notFound('Ticket not found');
      return ticket;
    },
    addSupportTicketAttachment: async (
      _p: unknown,
      args: { ticketId: string; attachment: AttachmentArg },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      const ticket = await SupportService.addAttachment(args.ticketId, auth.id, args.attachment);
      if (!ticket) throw notFound('Ticket not found');
      return ticket;
    },
    addSupportTicketUpdate: async (
      _p: unknown,
      args: { ticketId: string; message: string; addedBy?: string },
      ctx: GraphQLContext
    ) => {
      const auth = requireAuth(ctx);
      const ticket = await SupportService.addUpdate(
        args.ticketId,
        auth.id,
        args.message,
        (args.addedBy as AddedByArg) ?? ('user' as AddedByArg)
      );
      if (!ticket) throw notFound('Ticket not found');
      return ticket;
    },
    deleteSupportTicket: (_p: unknown, args: { ticketId: string }, ctx: GraphQLContext) => {
      requireAdmin(ctx);
      return SupportService.deleteTicket(args.ticketId);
    },
  },
};
