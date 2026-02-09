import mongoose, { Schema, Document } from 'mongoose';

export type TransactionType = 'expense' | 'income';

export interface IExpense extends Document {
  _id: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string | null;
  categoryId: string;
  paymentMethod?: string;
  creditFrom?: string;
  currency?: string;
  description?: string;
  timestamp: Date;
  userId?: string;
  trackerId?: string;
  createdBy?: string;
  createdByName?: string;
  lastUpdatedBy?: string;
  lastUpdatedByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['expense', 'income'],
      default: 'expense',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    categoryId: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: false,
      trim: true,
    },
    creditFrom: {
      type: String,
      required: false,
      trim: true,
    },
    currency: {
      type: String,
      required: false,
      trim: true,
      default: 'INR',
    },
    description: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    trackerId: {
      type: String,
      trim: true,
      default: 'default',
    },
    userId: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: String,
      trim: true,
    },
    createdByName: {
      type: String,
      trim: true,
    },
    lastUpdatedBy: {
      type: String,
      trim: true,
    },
    lastUpdatedByName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ExpenseSchema.index({ timestamp: -1 });
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ categoryId: 1 });
ExpenseSchema.index({ trackerId: 1 });
ExpenseSchema.index({ userId: 1 });
ExpenseSchema.index({ type: 1 });
ExpenseSchema.index({ trackerId: 1, type: 1 });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
