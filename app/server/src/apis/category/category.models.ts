import mongoose, { Schema, Document } from 'mongoose';

export type CategoryType = 'expense' | 'income' | 'debit_mode' | 'credit_mode';

export interface ISubCategory {
  id: string;
  name: string;
}

export interface ICategory extends Document {
  trackerId: string;
  name: string;
  type: CategoryType;
  subcategories: ISubCategory[];
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const CategorySchema: Schema = new Schema(
  {
    trackerId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['expense', 'income', 'debit_mode', 'credit_mode'],
      default: 'expense',
    },
    subcategories: {
      type: [SubCategorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by trackerId
CategorySchema.index({ trackerId: 1 });
CategorySchema.index({ trackerId: 1, type: 1 });
CategorySchema.index({ createdAt: -1 });

export default mongoose.model<ICategory>('Category', CategorySchema);
