import cron from 'node-cron';
import ReportScheduleService from '../apis/report-schedule/report-schedule.services';
import { AnalyticsService } from '../apis/analytics/analytics.services';
import { DateFilter } from '../apis/analytics/analytics.validators';
import { sendEmail, compileMjml } from './emailService';
import { logger } from '../utils/logger';
import config from '../config/config';

/**
 * Report Cron Runner
 * Checks for due report schedules every minute and sends email reports.
 * Uses node-cron for reliable cron-based scheduling.
 */

let running = false;

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return symbols[currency] || currency;
};

const getFilterForFrequency = (frequency: string): DateFilter => {
  switch (frequency) {
    case 'daily':
      return DateFilter.TODAY;
    case 'weekly':
      return DateFilter.LAST_7_DAYS;
    case 'monthly':
      return DateFilter.THIS_MONTH;
    default:
      return DateFilter.THIS_MONTH;
  }
};

const buildReportHtml = (
  trackerName: string,
  frequency: string,
  summary: any,
  categories: any[],
  currency: string
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

  const templateName =
    frequency === 'weekly'
      ? 'report-weekly'
      : frequency === 'yearly'
        ? 'report-yearly'
        : 'report-monthly';

  const now = new Date();
  const dateRange =
    frequency === 'yearly'
      ? now.getFullYear().toString()
      : `${trackerName} — ${now.toLocaleDateString('en-IN', { dateStyle: 'long' })}`;

  const insight =
    net >= 0
      ? `Great job! You saved ${sym}${net.toLocaleString('en-IN')} this period.`
      : `Heads up! You spent ${sym}${Math.abs(net).toLocaleString('en-IN')} more than your income this period.`;

  const variables: Record<string, string> = {
    userName: trackerName,
    dateRange,
    year: now.getFullYear().toString(),
    totalExpenses: `${sym}${totalExpenses.toLocaleString('en-IN')}`,
    totalIncome: `${sym}${totalIncome.toLocaleString('en-IN')}`,
    netBalance: `${net >= 0 ? '+' : '-'}${sym}${Math.abs(net).toLocaleString('en-IN')}`,
    transactionCount: String(summary?.transactionCount ?? 0),
    avgMonthly: `${sym}${Math.round(totalExpenses / 12).toLocaleString('en-IN')}`,
    categoryRows,
    monthlyRows: '',
    comparisonText: '',
    insight,
    appUrl: config.APP_URL,
  };

  return compileMjml(templateName, variables);
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
      'INR'
    );

    await sendEmail({
      to: schedule.userEmail,
      subject: `${schedule.trackerName} — ${schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} Report`,
      html,
    });

    await ReportScheduleService.markSent(schedule._id.toString());
    logger.info('Scheduled report sent', {
      scheduleId: schedule._id,
      tracker: schedule.trackerName,
    });
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
  logger.info('Report scheduler started (running every minute via cron)');

  // Schedule cron job to run every minute
  cron.schedule('* * * * *', async () => {
    await tick();
  });

  // Run once immediately to catch any overdue schedules
  tick().catch((error: any) => {
    logger.error('Initial report cron execution error', { error: error.message });
  });
};
