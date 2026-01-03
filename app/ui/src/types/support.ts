export type TicketType = 'PaymentRelated' | 'BugInApp' | 'DataLoss' | 'FeatureRequest' | 'Other';
export type TicketStatus = 'Open' | 'InProgress' | 'Closed' | 'Escalated';

export interface AttachmentMetadata {
  fileId: string;
  filePath: string;
  fileName: string;
  fileUrl: string;
}

export interface TicketUpdate {
  message: string;
  addedBy: 'user' | 'agent';
  addedAt: string;
}

export interface SupportTicket {
  _id: string;
  ticketId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  attachments: AttachmentMetadata[];
  updates?: TicketUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketPayload {
  type: TicketType;
  subject: string;
  description: string;
  attachments?: AttachmentMetadata[];
}

export interface UpdateStatusPayload {
  status: TicketStatus;
}

export interface AddUpdatePayload {
  message: string;
  addedBy: 'user' | 'agent';
}

export interface TicketFilters {
  status?: TicketStatus;
  type?: TicketType;
  limit?: number;
  skip?: number;
}

export interface TicketStats {
  open: number;
  inProgress: number;
  closed: number;
  escalated: number;
  total: number;
}
