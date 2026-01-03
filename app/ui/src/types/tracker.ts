import { Expense } from './index';

export interface Tracker {
  id: string;
  name: string;
  type: 'personal' | 'business';
  description?: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackerExpense extends Expense {
  trackerId: string;
}
