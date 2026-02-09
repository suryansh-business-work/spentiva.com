import { Expense } from './index';

export interface SharedUser {
  userId: string;
  email: string;
  name?: string;
  role: 'viewer' | 'editor';
  status: 'pending' | 'accepted' | 'rejected';
  invitedAt: string;
}

export interface Tracker {
  id: string;
  name: string;
  type: 'personal' | 'business';
  description?: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  botImage?: string;
  isOwner?: boolean;
  sharedWith?: SharedUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackerExpense extends Expense {
  trackerId: string;
}
