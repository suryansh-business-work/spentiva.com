export interface Tracker {
  id: string;
  name: string;
  type: 'personal' | 'business';
  description?: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackerFormData {
  name: string;
  type: 'personal' | 'business';
  description: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}
