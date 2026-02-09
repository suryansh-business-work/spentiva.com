import { z } from 'zod';

export const createScheduleSchema = z.object({
  trackerId: z.string().min(1, 'Tracker ID is required'),
  trackerName: z.string().min(1, 'Tracker name is required'),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  dayOfWeek: z.number().min(0).max(6).optional(),
  dayOfMonth: z.number().min(1).max(28).optional(),
  hour: z.number().min(0).max(23).default(9),
  timezone: z.string().default('Asia/Kolkata'),
}).refine(
  (data) => {
    if (data.frequency === 'weekly' && data.dayOfWeek === undefined) return false;
    if (data.frequency === 'monthly' && data.dayOfMonth === undefined) return false;
    return true;
  },
  { message: 'dayOfWeek required for weekly, dayOfMonth required for monthly schedules' }
);

export const updateScheduleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  dayOfMonth: z.number().min(1).max(28).optional(),
  hour: z.number().min(0).max(23).optional(),
  timezone: z.string().optional(),
  enabled: z.boolean().optional(),
});
