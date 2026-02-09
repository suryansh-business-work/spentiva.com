import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReportSchedule extends Document {
  _id: Types.ObjectId;
  userId: string;
  userEmail: string;
  trackerId: string;
  trackerName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0=Sun, 6=Sat (for weekly)
  dayOfMonth?: number; // 1-28 (for monthly)
  hour: number; // 0-23
  timezone: string;
  enabled: boolean;
  lastSentAt?: Date;
  nextRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportScheduleSchema = new Schema<IReportSchedule>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    trackerId: { type: String, required: true },
    trackerName: { type: String, required: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    dayOfWeek: { type: Number, min: 0, max: 6 },
    dayOfMonth: { type: Number, min: 1, max: 28 },
    hour: { type: Number, min: 0, max: 23, default: 9 },
    timezone: { type: String, default: 'Asia/Kolkata' },
    enabled: { type: Boolean, default: true },
    lastSentAt: { type: Date },
    nextRunAt: { type: Date },
  },
  { timestamps: true }
);

ReportScheduleSchema.index({ enabled: 1, nextRunAt: 1 });

export default mongoose.model<IReportSchedule>('ReportSchedule', ReportScheduleSchema);
