import cron from 'node-cron';
import categoryModels from '../category/category.models';
import expenseModels from '../expense/expense.models';
import TrackerModel from './tracker.models';
import { logger } from '../../utils/logger';
import crypto from 'crypto';

/**
 * In-memory OTP store for tracker deletion
 * Key: `${userId}:${trackerId}`, Value: { otp, expiresAt }
 */
const deleteOtpStore = new Map<string, { otp: string; expiresAt: number }>();

// Clean up expired OTPs every 5 minutes using cron job
cron.schedule('*/5 * * * *', () => {
  const now = Date.now();
  for (const [key, value] of deleteOtpStore) {
    if (value.expiresAt < now) deleteOtpStore.delete(key);
  }
});

/**
 * Tracker Service - Business logic for tracker operations
 */
class TrackerService {
  /**
   * Helper to generate unique IDs for subcategories
   */
  private genId(prefix: string, idx: number): string {
    return `${Date.now()}-${prefix}${idx}`;
  }

  /**
   * Default expense categories to create with new tracker
   */
  private get DEFAULT_CATEGORIES() {
    return [
      {
        name: 'Food & Dining',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 1), name: 'Groceries' },
          { id: this.genId('e', 2), name: 'Restaurants' },
          { id: this.genId('e', 3), name: 'Fast Food' },
          { id: this.genId('e', 4), name: 'Coffee & Tea' },
          { id: this.genId('e', 5), name: 'Snacks' },
          { id: this.genId('e', 6), name: 'Food Delivery' },
        ],
      },
      {
        name: 'Transportation',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 7), name: 'Fuel' },
          { id: this.genId('e', 8), name: 'Public Transport' },
          { id: this.genId('e', 9), name: 'Taxi/Uber' },
          { id: this.genId('e', 10), name: 'Parking' },
          { id: this.genId('e', 11), name: 'Toll' },
          { id: this.genId('e', 12), name: 'Vehicle Maintenance' },
        ],
      },
      {
        name: 'Shopping',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 13), name: 'Clothing' },
          { id: this.genId('e', 14), name: 'Electronics' },
          { id: this.genId('e', 15), name: 'Books' },
          { id: this.genId('e', 16), name: 'Gifts' },
          { id: this.genId('e', 17), name: 'Home Decor' },
          { id: this.genId('e', 18), name: 'Personal Care' },
        ],
      },
      {
        name: 'Entertainment',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 19), name: 'Movies' },
          { id: this.genId('e', 20), name: 'Games' },
          { id: this.genId('e', 21), name: 'Hobbies' },
          { id: this.genId('e', 22), name: 'Streaming Services' },
          { id: this.genId('e', 23), name: 'Events & Concerts' },
          { id: this.genId('e', 24), name: 'Sports' },
        ],
      },
      {
        name: 'Bills & Utilities',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 25), name: 'Electricity' },
          { id: this.genId('e', 26), name: 'Water' },
          { id: this.genId('e', 27), name: 'Internet' },
          { id: this.genId('e', 28), name: 'Mobile Recharge' },
          { id: this.genId('e', 29), name: 'Gas' },
          { id: this.genId('e', 30), name: 'Rent' },
          { id: this.genId('e', 31), name: 'EMI' },
          { id: this.genId('e', 32), name: 'Insurance' },
        ],
      },
      {
        name: 'Health & Fitness',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 33), name: 'Medicine' },
          { id: this.genId('e', 34), name: 'Doctor' },
          { id: this.genId('e', 35), name: 'Gym' },
          { id: this.genId('e', 36), name: 'Hospital' },
          { id: this.genId('e', 37), name: 'Lab Tests' },
        ],
      },
      {
        name: 'Education',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 38), name: 'Tuition Fee' },
          { id: this.genId('e', 39), name: 'Courses' },
          { id: this.genId('e', 40), name: 'Books & Stationery' },
          { id: this.genId('e', 41), name: 'Exam Fee' },
        ],
      },
      {
        name: 'Travel',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 42), name: 'Flights' },
          { id: this.genId('e', 43), name: 'Hotels' },
          { id: this.genId('e', 44), name: 'Train' },
          { id: this.genId('e', 45), name: 'Bus' },
          { id: this.genId('e', 46), name: 'Sightseeing' },
        ],
      },
      {
        name: 'Investments',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 47), name: 'Mutual Funds' },
          { id: this.genId('e', 48), name: 'Stocks' },
          { id: this.genId('e', 49), name: 'Fixed Deposit' },
          { id: this.genId('e', 50), name: 'PPF' },
          { id: this.genId('e', 51), name: 'Gold' },
        ],
      },
      {
        name: 'Personal & Family',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 52), name: 'Salon & Grooming' },
          { id: this.genId('e', 53), name: 'Laundry' },
          { id: this.genId('e', 54), name: 'Donations' },
          { id: this.genId('e', 55), name: 'Kids' },
          { id: this.genId('e', 56), name: 'Pet Care' },
        ],
      },
      {
        name: 'Miscellaneous',
        type: 'expense',
        subcategories: [
          { id: this.genId('e', 57), name: 'Other' },
          { id: this.genId('e', 58), name: 'ATM Withdrawal' },
          { id: this.genId('e', 59), name: 'Fees & Charges' },
        ],
      },
    ];
  }

  /**
   * Default income categories
   */
  private get DEFAULT_INCOME_CATEGORIES() {
    return [
      {
        name: 'Salary & Wages',
        type: 'income',
        subcategories: [
          { id: this.genId('ic', 1), name: 'Salary' },
          { id: this.genId('ic', 2), name: 'Bonus' },
          { id: this.genId('ic', 3), name: 'Overtime' },
          { id: this.genId('ic', 4), name: 'Allowance' },
        ],
      },
      {
        name: 'Freelance & Business',
        type: 'income',
        subcategories: [
          { id: this.genId('ic', 5), name: 'Freelance' },
          { id: this.genId('ic', 6), name: 'Consulting' },
          { id: this.genId('ic', 7), name: 'Business Income' },
          { id: this.genId('ic', 8), name: 'Commission' },
          { id: this.genId('ic', 9), name: 'Side Hustle' },
        ],
      },
      {
        name: 'Investments & Returns',
        type: 'income',
        subcategories: [
          { id: this.genId('ic', 10), name: 'Dividends' },
          { id: this.genId('ic', 11), name: 'Interest' },
          { id: this.genId('ic', 12), name: 'Capital Gains' },
          { id: this.genId('ic', 13), name: 'Mutual Fund Returns' },
          { id: this.genId('ic', 14), name: 'FD Maturity' },
        ],
      },
      {
        name: 'Refunds & Cashback',
        type: 'income',
        subcategories: [
          { id: this.genId('ic', 15), name: 'Refund' },
          { id: this.genId('ic', 16), name: 'Cashback' },
          { id: this.genId('ic', 17), name: 'Reimbursement' },
          { id: this.genId('ic', 18), name: 'Insurance Claim' },
        ],
      },
      {
        name: 'Other Income',
        type: 'income',
        subcategories: [
          { id: this.genId('ic', 19), name: 'Gift' },
          { id: this.genId('ic', 20), name: 'Rental Income' },
          { id: this.genId('ic', 21), name: 'Pension' },
          { id: this.genId('ic', 22), name: 'Pocket Money' },
          { id: this.genId('ic', 23), name: 'Others' },
        ],
      },
    ];
  }

  /**
   * Default debit modes (how money goes out)
   */
  private get DEFAULT_DEBIT_MODES() {
    return [
      {
        name: 'Digital Payments',
        type: 'debit_mode',
        subcategories: [
          { id: this.genId('dm', 1), name: 'UPI' },
          { id: this.genId('dm', 2), name: 'Credit Card' },
          { id: this.genId('dm', 3), name: 'Debit Card' },
          { id: this.genId('dm', 4), name: 'Net Banking' },
          { id: this.genId('dm', 5), name: 'Wallet' },
          { id: this.genId('dm', 6), name: 'EMI' },
        ],
      },
      {
        name: 'Cash & Others',
        type: 'debit_mode',
        subcategories: [
          { id: this.genId('dm', 7), name: 'Cash' },
          { id: this.genId('dm', 8), name: 'Cheque' },
          { id: this.genId('dm', 9), name: 'Bank Transfer' },
          { id: this.genId('dm', 10), name: 'Auto Debit' },
        ],
      },
    ];
  }

  /**
   * Default credit modes (how money comes in)
   */
  private get DEFAULT_CREDIT_MODES() {
    return [
      {
        name: 'Bank & Digital',
        type: 'credit_mode',
        subcategories: [
          { id: this.genId('cm', 1), name: 'Bank Transfer' },
          { id: this.genId('cm', 2), name: 'UPI' },
          { id: this.genId('cm', 3), name: 'Online Payment' },
          { id: this.genId('cm', 4), name: 'Wallet' },
          { id: this.genId('cm', 5), name: 'Direct Deposit' },
        ],
      },
      {
        name: 'Cash & Others',
        type: 'credit_mode',
        subcategories: [
          { id: this.genId('cm', 6), name: 'Cash' },
          { id: this.genId('cm', 7), name: 'Cheque' },
          { id: this.genId('cm', 8), name: 'Demand Draft' },
        ],
      },
    ];
  }

  /**
   * Get all trackers for a user
   */
  async getAllTrackers(userId: string) {
    // Get owned trackers + trackers shared with the user
    const trackers = await TrackerModel.find({
      $or: [{ userId }, { 'sharedWith.userId': userId, 'sharedWith.status': 'accepted' }],
    }).sort({ createdAt: -1 });

    return trackers.map(tracker => ({
      id: tracker._id.toString(),
      name: tracker.name,
      type: tracker.type,
      description: tracker.description,
      currency: tracker.currency,
      botImage: tracker.botImage,
      isOwner: tracker.userId === userId,
      sharedWith: tracker.sharedWith,
      createdAt: tracker.createdAt,
      updatedAt: tracker.updatedAt,
    }));
  }

  /**
   * Create a new tracker with default categories
   */
  async createTracker(
    userId: string,
    data: {
      name: string;
      type: 'personal' | 'business';
      description?: string;
      currency: 'INR' | 'USD' | 'EUR' | 'GBP';
    }
  ) {
    // Validate required fields
    if (!data.name || !data.type || !data.currency) {
      throw new Error('Missing required fields: name, type, and currency are required');
    }

    // Create tracker
    const tracker = new TrackerModel({
      name: data.name,
      type: data.type,
      description: data.description,
      currency: data.currency,
      userId,
    });

    await tracker.save();

    // Create default categories for the new tracker (all 4 types)
    const allDefaults = [
      ...this.DEFAULT_CATEGORIES,
      ...this.DEFAULT_INCOME_CATEGORIES,
      ...this.DEFAULT_DEBIT_MODES,
      ...this.DEFAULT_CREDIT_MODES,
    ];

    const defaultCategories = allDefaults.map(category => ({
      trackerId: tracker._id.toString(),
      name: category.name,
      type: category.type,
      subcategories: category.subcategories,
    }));

    await categoryModels.insertMany(defaultCategories);

    return {
      id: (tracker._id as unknown as string).toString(),
      name: tracker.name,
      type: tracker.type,
      description: tracker.description,
      currency: tracker.currency,
      createdAt: tracker.createdAt,
      updatedAt: tracker.updatedAt,
    };
  }

  /**
   * Get a single tracker by ID
   */
  async getTrackerById(userId: string, trackerId: string) {
    const tracker = await TrackerModel.findOne({
      _id: trackerId,
      $or: [{ userId }, { 'sharedWith.userId': userId, 'sharedWith.status': 'accepted' }],
    });

    if (!tracker) {
      throw new Error('Tracker not found');
    }

    return {
      id: tracker._id.toString(),
      name: tracker.name,
      type: tracker.type,
      description: tracker.description,
      currency: tracker.currency,
      botImage: tracker.botImage,
      isOwner: tracker.userId === userId,
      sharedWith: tracker.sharedWith,
      createdAt: tracker.createdAt,
      updatedAt: tracker.updatedAt,
    };
  }

  /**
   * Update a tracker
   */
  async updateTracker(
    userId: string,
    trackerId: string,
    data: {
      name?: string;
      type?: 'personal' | 'business';
      description?: string;
      currency?: 'INR' | 'USD' | 'EUR' | 'GBP';
      botImage?: string;
    }
  ) {
    // Build update object only with provided fields
    const updateFields: Record<string, any> = {};
    if (data.name !== undefined) updateFields.name = data.name;
    if (data.type !== undefined) updateFields.type = data.type;
    if (data.description !== undefined) updateFields.description = data.description;
    if (data.currency !== undefined) updateFields.currency = data.currency;
    if (data.botImage !== undefined) updateFields.botImage = data.botImage;

    const tracker = await TrackerModel.findOneAndUpdate({ _id: trackerId, userId }, updateFields, {
      new: true,
    });

    if (!tracker) {
      throw new Error('Tracker not found');
    }

    // Update tracker information in usage records
    if (data.name || data.type) {
      try {
        const { updateTrackerInUsage } = await import('../usage-log/usage-log.services');
        await updateTrackerInUsage(trackerId, {
          trackerName: tracker.name,
          trackerType: tracker.type,
        });
        logger.info('Updated tracker in usage records', { trackerId });
      } catch (usageError) {
        logger.error('Error updating tracker in usage', { trackerId, error: usageError });
        // Don't fail the update operation if usage update fails
      }
    }

    return {
      id: tracker._id.toString(),
      name: tracker.name,
      type: tracker.type,
      description: tracker.description,
      currency: tracker.currency,
      botImage: tracker.botImage,
      createdAt: tracker.createdAt,
      updatedAt: tracker.updatedAt,
    };
  }

  /**
   * Delete a tracker and all associated data
   */
  async deleteTracker(userId: string, trackerId: string) {
    const tracker = await TrackerModel.findOneAndDelete({ _id: trackerId, userId });

    if (!tracker) {
      throw new Error('Tracker not found');
    }

    // Mark tracker as deleted in usage records (so data is preserved)
    try {
      const { markTrackerAsDeleted } = await import('../usage-log/usage-log.services');
      await markTrackerAsDeleted(trackerId);
      logger.info('Marked tracker as deleted in usage records', { trackerId });
    } catch (usageError) {
      logger.error('Error marking tracker as deleted in usage', { trackerId, error: usageError });
      // Don't fail the delete operation if usage marking fails
    }

    // Delete all expenses associated with this tracker
    await expenseModels.deleteMany({ trackerId });

    // Delete all categories associated with this tracker
    await categoryModels.deleteMany({ trackerId });

    return {
      id: trackerId,
      message: 'Tracker and associated expenses deleted successfully',
    };
  }

  /**
   * Share a tracker with another user by email
   */
  async shareTracker(
    ownerId: string,
    trackerId: string,
    data: { email: string; role: 'viewer' | 'editor' }
  ) {
    const tracker = await TrackerModel.findOne({ _id: trackerId, userId: ownerId });
    if (!tracker) {
      throw new Error('Tracker not found');
    }

    // Check if already shared with this email
    const existing = tracker.sharedWith.find(s => s.email === data.email);
    if (existing) {
      throw new Error('Tracker is already shared with this email');
    }

    tracker.sharedWith.push({
      userId: '', // Will be populated when the user accepts
      email: data.email,
      role: data.role,
      status: 'pending',
      invitedAt: new Date(),
    });

    await tracker.save();

    // Send invitation email (non-blocking)
    try {
      const { sendEmail, compileMjml } = await import('../../services/emailService');
      const config = await import('../../config/config');

      // Determine role permission text
      const rolePermission =
        data.role === 'editor'
          ? 'Full editing and management permissions'
          : 'View-only access to tracker data';

      // Create accept URL
      const acceptUrl = `${config.default.APP_URL}/trackers?accept=${trackerId}&email=${encodeURIComponent(data.email)}`;

      const html = compileMjml('tracker-invitation', {
        trackerName: tracker.name,
        trackerType: tracker.type || 'Expense Tracker',
        role: data.role.toUpperCase(),
        rolePermission,
        acceptUrl,
      });

      await sendEmail({
        to: data.email,
        subject: `You've been invited to collaborate on "${tracker.name}" - Spentiva`,
        html,
      });
    } catch (emailErr) {
      logger.error('Failed to send share invite email', {
        trackerId,
        email: data.email,
        error: emailErr,
      });
    }

    return { sharedWith: tracker.sharedWith };
  }

  /**
   * Remove a shared user from a tracker
   */
  async removeSharedUser(ownerId: string, trackerId: string, email: string) {
    const tracker = await TrackerModel.findOne({ _id: trackerId, userId: ownerId });
    if (!tracker) {
      throw new Error('Tracker not found');
    }

    const idx = tracker.sharedWith.findIndex(s => s.email === email);
    if (idx === -1) {
      throw new Error('User not found in shared list');
    }

    tracker.sharedWith.splice(idx, 1);
    await tracker.save();

    return { sharedWith: tracker.sharedWith };
  }

  /**
   * Resend invitation email to a shared user
   */
  async resendShareInvite(ownerId: string, trackerId: string, email: string) {
    const tracker = await TrackerModel.findOne({ _id: trackerId, userId: ownerId });
    if (!tracker) {
      throw new Error('Tracker not found');
    }

    const shared = tracker.sharedWith.find(s => s.email === email);
    if (!shared) {
      throw new Error('User not found in shared list');
    }

    // Re-send invitation email
    try {
      const { sendEmail, compileMjml } = await import('../../services/emailService');
      const config = await import('../../config/config');

      // Determine role permission text
      const rolePermission =
        shared.role === 'editor'
          ? 'Full editing and management permissions'
          : 'View-only access to tracker data';

      // Create accept URL
      const acceptUrl = `${config.default.APP_URL}/trackers?accept=${trackerId}&email=${encodeURIComponent(email)}`;

      const html = compileMjml('tracker-invitation', {
        trackerName: tracker.name,
        trackerType: tracker.type || 'Expense Tracker',
        role: shared.role.toUpperCase(),
        rolePermission,
        acceptUrl,
      });

      await sendEmail({
        to: email,
        subject: `Reminder: You've been invited to collaborate on "${tracker.name}" - Spentiva`,
        html,
      });
    } catch (emailErr) {
      logger.error('Failed to resend share invite email', { trackerId, email, error: emailErr });
    }

    return { message: 'Invitation re-sent' };
  }

  /**
   * Respond to a tracker invitation (accept or decline)
   */
  async respondToInvite(
    userId: string,
    userEmail: string,
    trackerId: string,
    response: 'accepted' | 'rejected'
  ) {
    const tracker = await TrackerModel.findOne({
      _id: trackerId,
      'sharedWith.email': userEmail,
    });

    if (!tracker) {
      throw new Error('Invitation not found');
    }

    const shared = tracker.sharedWith.find(s => s.email === userEmail);
    if (!shared) {
      throw new Error('You are not invited to this tracker');
    }

    if (shared.status !== 'pending') {
      throw new Error(`Invitation already ${shared.status}`);
    }

    shared.status = response;
    if (response === 'accepted') {
      shared.userId = userId;
    }

    await tracker.save();
    return {
      status: response,
      trackerName: tracker.name,
      trackerId: tracker._id.toString(),
    };
  }

  /**
   * Request OTP for tracker deletion — generates a 6-digit code and returns it.
   * The controller is responsible for emailing it.
   */
  async requestDeleteOtp(
    userId: string,
    trackerId: string
  ): Promise<{ otp: string; trackerName: string }> {
    const tracker = await TrackerModel.findOne({ _id: trackerId, userId });
    if (!tracker) throw new Error('Tracker not found');

    const otp = crypto.randomInt(100000, 999999).toString();
    const key = `${userId}:${trackerId}`;

    deleteOtpStore.set(key, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    logger.info('Delete OTP generated', { trackerId, userId });
    return { otp, trackerName: tracker.name };
  }

  /**
   * Verify OTP and delete the tracker if valid.
   */
  async confirmDeleteWithOtp(userId: string, trackerId: string, otp: string) {
    const key = `${userId}:${trackerId}`;
    const stored = deleteOtpStore.get(key);

    if (!stored) throw new Error('No OTP requested or OTP expired. Please request a new one.');
    if (stored.expiresAt < Date.now()) {
      deleteOtpStore.delete(key);
      throw new Error('OTP has expired. Please request a new one.');
    }
    if (stored.otp !== otp) throw new Error('Invalid OTP. Please try again.');

    deleteOtpStore.delete(key);
    return this.deleteTracker(userId, trackerId);
  }
}

export default new TrackerService();
