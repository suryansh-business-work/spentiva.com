import ReportScheduleService from '../apis/report-schedule/report-schedule.services';
import { AnalyticsService } from '../apis/analytics/analytics.services';
import { DateFilter } from '../apis/analytics/analytics.validators';
import { sendEmail } from './emailService';
import { logger } from '../utils/logger';

/**
 * Report Cron Runner
 * Checks for due report schedules every minute and sends email reports.
 * Uses setInterval instead of node-cron to avoid an extra dependency.
 */

const INTERVAL_MS = 60 * 1000; // 1 minute
let running = false;

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return symbols[currency] || currency;
};

const getFilterForFrequency = (
  frequency: string
): DateFilter => {
  switch (frequency) {
    case 'daily': return DateFilter.TODAY;
    case 'weekly': return DateFilter.LAST_7_DAYS;
    case 'monthly': return DateFilter.THIS_MONTH;
    default: return DateFilter.THIS_MONTH;
  }
};

const buildReportHtml = (
  trackerName: string,
  frequency: string,
  summary: any,
  categories: any[],
  currency: string,
): string => {
  const sym = getCurrencySymbol(currency);
  const totalExpenses = summary?.totalExpenses ?? 0;
  const totalIncome = summary?.totalIncome ?? 0;
  const net = totalIncome - totalExpenses;

  const categoryRows = categories
    .slice(0, 10)
    .map(
      (c: any) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${c.category}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${sym}${c.total?.toLocaleString('en-IN')}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${c.count}</td>
        </tr>`
    )
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#1976d2;margin-bottom:4px;">📊 ${trackerName} — ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Report</h2>
      <p style="color:#757575;margin-top:0;">Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>

      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr>
          <td style="padding:12px;background:#e8f5e9;border-radius:8px 0 0 8px;">
            <strong>Income</strong><br/><span style="font-size:20px;color:#2e7d32;">${sym}${totalIncome.toLocaleString('en-IN')}</span>
          </td>
          <td style="padding:12px;background:#ffebee;">
            <strong>Expenses</strong><br/><span style="font-size:20px;color:#c62828;">${sym}${totalExpenses.toLocaleString('en-IN')}</span>
          </td>
          <td style="padding:12px;background:${net >= 0 ? '#e3f2fd' : '#fff3e0'};border-radius:0 8px 8px 0;">
            <strong>Net</strong><br/><span style="font-size:20px;color:${net >= 0 ? '#1565c0' : '#e65100'};">${net >= 0 ? '+' : '-'}${sym}${Math.abs(net).toLocaleString('en-IN')}</span>
          </td>
        </tr>
      </table>

      ${categories.length > 0 ? `
        <h3 style="color:#333;margin-bottom:8px;">Top Categories</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:8px 12px;text-align:left;">Category</th>
              <th style="padding:8px 12px;text-align:right;">Amount</th>
              <th style="padding:8px 12px;text-align:right;">Txns</th>
            </tr>
          </thead>
          <tbody>${categoryRows}</tbody>
        </table>
      ` : '<p style="color:#999;">No transactions in this period.</p>'}

      <p style="margin-top:24px;color:#999;font-size:12px;">
        This is an automated report from Spentiva. You can manage your report schedules in the app settings.
      </p>
    </div>
  `;
};

const processSchedule = async (schedule: any): Promise<void> => {
  try {
    const filter = getFilterForFrequency(schedule.frequency);
    const queryDto = { trackerId: schedule.trackerId, filter };

    // Fetch analytics data
    const summary = await AnalyticsService.getSummaryStats(queryDto);
    const categories = await AnalyticsService.getExpensesByCategory(queryDto);

    const html = buildReportHtml(
      schedule.trackerName,
      schedule.frequency,
      summary || {},
      categories || [],
      'INR',
    );

    await sendEmail({
      to: schedule.userEmail,
      subject: `${schedule.trackerName} — ${schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} Report`,
      html,
    });

    await ReportScheduleService.markSent(schedule._id.toString());
    logger.info('Scheduled report sent', { scheduleId: schedule._id, tracker: schedule.trackerName });
  } catch (error: any) {
    logger.error('Failed to send scheduled report', {
      scheduleId: schedule._id,
      error: error.message,
    });
  }
};

const tick = async (): Promise<void> => {
  if (running) return;
  running = true;

  try {
    const due = await ReportScheduleService.getDueSchedules();
    if (due.length > 0) {
      logger.info(`Processing ${due.length} due report schedule(s)`);
      for (const schedule of due) {
        await processSchedule(schedule);
      }
    }
  } catch (error: any) {
    logger.error('Report cron tick error', { error: error.message });
  } finally {
    running = false;
  }
};

export const startReportCron = (): void => {
  logger.info('Report scheduler started (checking every 60s)');
  setInterval(tick, INTERVAL_MS);
  // Run once immediately after a short delay to catch any overdue
  setTimeout(tick, 5000);
};
