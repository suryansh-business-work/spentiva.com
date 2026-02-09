import mongoose, { Schema, Document } from 'mongoose';

/**
 * Shared user entry
 */
export interface ISharedUser {
  userId: string;
  email: string;
  name?: string;
  role: 'viewer' | 'editor';
  status: 'pending' | 'accepted' | 'rejected';
  invitedAt: Date;
}

/**
 * Tracker Interface
 */
export interface ITracker extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: 'personal' | 'business';
  description?: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  botImage?: string;
  userId: string;
  sharedWith: ISharedUser[];
  createdAt: Date;
  updatedAt: Date;
}

const SharedUserSchema = new Schema(
  {
    userId: { type: String, default: '' },
    email: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ['viewer', 'editor'], default: 'editor' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    invitedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/**
 * Tracker Schema
 */
const TrackerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['personal', 'business'],
      default: 'personal',
    },
    description: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ['INR', 'USD', 'EUR', 'GBP'],
      default: 'INR',
    },
    botImage: {
      type: String,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    sharedWith: {
      type: [SharedUserSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
TrackerSchema.index({ createdAt: -1 });
TrackerSchema.index({ type: 1 });
TrackerSchema.index({ userId: 1 });
TrackerSchema.index({ 'sharedWith.userId': 1 });

export default mongoose.model<ITracker>('Tracker', TrackerSchema);
