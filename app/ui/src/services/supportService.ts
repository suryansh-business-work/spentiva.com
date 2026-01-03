import { postRequest, getRequest, putRequest, deleteRequest } from '../utils/http';
import { endpoints } from '../config/api';
import { parseResponseData, parseResponseMessage } from '../utils/response-parser';
import {
  CreateTicketPayload,
  SupportTicket,
  TicketFilters,
  TicketStats,
  UpdateStatusPayload,
  AttachmentMetadata,
  AddUpdatePayload,
} from '../types/support';

// Create support ticket
export const createSupportTicket = async (payload: CreateTicketPayload): Promise<SupportTicket> => {
  const response = await postRequest(endpoints.support.createTicket, payload);
  const data = parseResponseData(response, {});
  return (data as any)?.ticket || data;
};

// Get user's tickets or all tickets (admin)
export const getUserTickets = async (
  filters?: TicketFilters
): Promise<{ tickets: SupportTicket[]; total: number }> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.skip) params.append('skip', filters.skip.toString());

  const queryString = params.toString();
  const url = queryString
    ? `${endpoints.support.getTickets}?${queryString}`
    : endpoints.support.getTickets;

  const response = await getRequest(url);
  return parseResponseData(response, { tickets: [], total: 0 }) as {
    tickets: SupportTicket[];
    total: number;
  };
};

// Get ticket by ID
export const getTicketById = async (ticketId: string): Promise<SupportTicket> => {
  const response = await getRequest(endpoints.support.getTicketById(ticketId));
  return parseResponseData(response, {}) as SupportTicket;
};

// Update ticket status
export const updateTicketStatus = async (
  ticketId: string,
  status: UpdateStatusPayload
): Promise<SupportTicket> => {
  const response = await putRequest(endpoints.support.updateStatus(ticketId), status);
  const data = parseResponseData(response, {});
  return (data as any)?.ticket || data;
};

// Add attachment to ticket
export const addAttachmentToTicket = async (
  ticketId: string,
  attachment: AttachmentMetadata
): Promise<SupportTicket> => {
  const response = await postRequest(endpoints.support.addAttachment(ticketId), attachment);
  const data = parseResponseData(response, {});
  return (data as any)?.ticket || data;
};

// Add update message to ticket
export const addUpdateToTicket = async (
  ticketId: string,
  update: AddUpdatePayload
): Promise<SupportTicket> => {
  const response = await postRequest(endpoints.support.addUpdate(ticketId), update);
  const data = parseResponseData(response, {});
  return (data as any)?.ticket || data;
};

// Delete ticket (admin only)
export const deleteTicket = async (ticketId: string): Promise<string> => {
  const response = await deleteRequest(endpoints.support.deleteTicket(ticketId));
  return parseResponseMessage(response, 'Ticket deleted successfully');
};

// Get ticket statistics
export const getTicketStats = async (): Promise<TicketStats> => {
  const response = await getRequest(endpoints.support.getStats);
  return parseResponseData(response, {}) as TicketStats;
};
