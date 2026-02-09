import ReportScheduleModel, { IReportSchedule } from './report-schedule.models';
import { logger } from '../../utils/logger';

class ReportScheduleService {
  /**
   * Compute next run date based on frequency
   */
  private computeNextRun(
    frequency: string,
    hour: number,
    dayOfWeek?: number,
    dayOfMonth?: number
  ): Date {
    const now = new Date();
    const next = new Date();
    next.setMinutes(0, 0, 0);
    next.setHours(hour);

    switch (frequency) {
      case 'daily':
        if (next <= now) next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + ((7 + (dayOfWeek ?? 1) - next.getDay()) % 7 || 7));
        break;
      case 'monthly':
        next.setDate(dayOfMonth ?? 1);
        if (next <= now) next.setMonth(next.getMonth() + 1);
        break;
    }
    return next;
  }

  async createSchedule(userId: string, userEmail: string, data: any): Promise<IReportSchedule> {
    // Only one schedule per tracker per user
    const existing = await ReportScheduleModel.findOne({ userId, trackerId: data.trackerId });
    if (existing) {
      throw new Error(
        'A report schedule already exists for this tracker. Update or delete it instead.'
      );
    }

    const nextRunAt = this.computeNextRun(
      data.frequency,
      data.hour,
      data.dayOfWeek,
      data.dayOfMonth
    );

    const schedule = await ReportScheduleModel.create({
      userId,
      userEmail,
      trackerId: data.trackerId,
      trackerName: data.trackerName,
      frequency: data.frequency,
      dayOfWeek: data.dayOfWeek,
      dayOfMonth: data.dayOfMonth,
      hour: data.hour ?? 9,
      timezone: data.timezone ?? 'Asia/Kolkata',
      enabled: true,
      nextRunAt,
    });

    logger.info('Report schedule created', {
      scheduleId: schedule._id,
      userId,
      trackerId: data.trackerId,
    });
    return schedule;
  }

  async getSchedulesByUser(userId: string) {
    return ReportScheduleModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async getScheduleByTracker(userId: string, trackerId: string) {
    return ReportScheduleModel.findOne({ userId, trackerId }).lean();
  }

  async updateSchedule(userId: string, scheduleId: string, data: any) {
    const schedule = await ReportScheduleModel.findOne({ _id: scheduleId, userId });
    if (!schedule) throw new Error('Schedule not found');

    Object.assign(schedule, data);
    schedule.nextRunAt = this.computeNextRun(
      schedule.frequency,
      schedule.hour,
      schedule.dayOfWeek,
      schedule.dayOfMonth
    );
    await schedule.save();

    logger.info('Report schedule updated', { scheduleId, userId });
    return schedule;
  }

  async deleteSchedule(userId: string, scheduleId: string): Promise<void> {
    const result = await ReportScheduleModel.findOneAndDelete({ _id: scheduleId, userId });
    if (!result) throw new Error('Schedule not found');
    logger.info('Report schedule deleted', { scheduleId, userId });
  }

  /**
   * Get all schedules that are due for execution now.
   * Called by the cron runner every minute.
   */
  async getDueSchedules(): Promise<IReportSchedule[]> {
    const now = new Date();
    return ReportScheduleModel.find({ enabled: true, nextRunAt: { $lte: now } });
  }

  /**
   * Advance the schedule's nextRunAt after successful send.
   */
  async markSent(scheduleId: string): Promise<void> {
    const schedule = await ReportScheduleModel.findById(scheduleId);
    if (!schedule) return;

    schedule.lastSentAt = new Date();
    schedule.nextRunAt = this.computeNextRun(
      schedule.frequency,
      schedule.hour,
      schedule.dayOfWeek,
      schedule.dayOfMonth
    );
    await schedule.save();
  }
}

export default new ReportScheduleService();
