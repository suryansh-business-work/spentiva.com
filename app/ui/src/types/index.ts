export type TransactionType = 'expense' | 'income';

export interface Expense {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod?: string;
  creditFrom?: string;
  currency: string;
  description?: string;
  timestamp: string;
  createdBy?: string;
  createdByName?: string;
  lastUpdatedBy?: string;
  lastUpdatedByName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  expense?: Expense; // Legacy support
  expenses?: Expense[]; // New array support
  missingCategories?: string[]; // Categories that need to be added
  timestamp: Date;
}

export interface ParsedExpense {
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod?: string;
  creditFrom?: string;
  currency: string;
  description?: string;
  timestamp?: string;
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isVerified: boolean;
  mfaEnabled: boolean;
  provider: string;
  role?: string;
  roleSlug?: string; // Role slug from external auth (e.g., 'admin', 'user')
  createdAt: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
}

export interface Permission {
  resource: string;
  action: string;
  allowed: boolean;
}

export interface RoleDetails {
  name: string;
  slug: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  isSystem: boolean;
}

export interface Role {
  role: string;
  roleDetails: RoleDetails;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays: number;
}

export interface OrgOptions {
  mfaEnabled: boolean;
  lastLoginDetails: boolean;
  showRoleInProfile: boolean;
  passwordPolicy: PasswordPolicy;
  sessionTimeout: number;
  allowedDomains: string[];
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  logo?: string;
  website?: string;
  orgOptions: OrgOptions;
}
