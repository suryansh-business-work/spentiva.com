import { useState, useCallback } from 'react';
import { Message } from '../../../types';

/**
 * Usage data structure stored in localStorage
 */
interface UsageData {
  userId: string;
  totalMessages: number;
  trackerUsage: Record<string, number>;
  currentMonth: string;
}

/**
 * Subscription plans and their limits
 */
const SUBSCRIPTION_LIMITS: Record<string, number> = {
  free: 50,
  pro: 500,
  businesspro: 2000,
};

/**
 * Custom hook to manage chat message state and usage tracking
 */
export const useChatMessages = (_trackerId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your expense & income tracker. Just type naturally, for example:\n\n💸 Expenses:\n• \"Lunch 250 credit card\"\n• \"Groceries 1500 from UPI\"\n• \"Paid 8000 rent via net banking\"\n• \"Bought shoes 2500 and shirt 1200\"\n\n💰 Income:\n• \"Salary 50000 credited\"\n• \"Got 1200 refund from Amazon\"\n• \"Freelance payment 15000 received\"\n• \"Cashback 500 from Paytm\"\n\n🔄 Multiple:\n• \"Salary 50k credited and spent 2000 on dinner\"",
      timestamp: new Date(),
    },
  ]);

  /**
   * Track message usage in localStorage
   */
  const trackMessageUsage = useCallback((trackerId?: string): UsageData => {
    const storedUsage = localStorage.getItem('usage_data');
    const storedUser = localStorage.getItem('user');
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Get current user ID
    let currentUserId = '';
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        currentUserId = user._id || user.id || '';
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }

    let usageData: UsageData = storedUsage
      ? JSON.parse(storedUsage)
      : {
          userId: currentUserId,
          totalMessages: 0,
          trackerUsage: {},
          currentMonth,
        };

    // Reset if new month OR different user
    if (usageData.currentMonth !== currentMonth || usageData.userId !== currentUserId) {
      usageData = {
        userId: currentUserId,
        totalMessages: 0,
        trackerUsage: {},
        currentMonth,
      };
    }

    // Increment total messages
    usageData.totalMessages += 1;

    // Increment tracker-specific usage
    if (trackerId) {
      usageData.trackerUsage[trackerId] = (usageData.trackerUsage[trackerId] || 0) + 1;
    }

    // Save to localStorage
    localStorage.setItem('usage_data', JSON.stringify(usageData));

    return usageData;
  }, []);

  /**
   * Check if user has reached their usage limit
   */
  const checkUsageLimit = useCallback((): boolean => {
    const storedUsage = localStorage.getItem('usage_data');
    const storedUser = localStorage.getItem('user');

    let accountType = 'free'; // Default to free plan
    let currentUserId = '';

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        accountType = (user.accountType || 'free').toLowerCase();
        currentUserId = user._id || user.id || '';
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }

    const currentLimit = SUBSCRIPTION_LIMITS[accountType] || SUBSCRIPTION_LIMITS.free;

    if (storedUsage) {
      const usageData: UsageData = JSON.parse(storedUsage);
      const currentMonth = new Date().toISOString().slice(0, 7);

      // Reset if new month OR different user
      if (usageData.currentMonth !== currentMonth || usageData.userId !== currentUserId) {
        // Clear old usage data for new month or new user
        localStorage.removeItem('usage_data');
        return true; // Allow message
      }

      return usageData.totalMessages < currentLimit;
    }

    return true; // First message
  }, []);

  /**
   * Add a new message to the chat
   */
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  /**
   * Add a user message
   */
  const addUserMessage = useCallback(
    (content: string): Message => {
      const message: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      addMessage(message);
      return message;
    },
    [addMessage]
  );

  /**
   * Add an assistant message
   */
  const addAssistantMessage = useCallback(
    (content: string, expenses?: any, missingCategories?: string[]): Message => {
      const message: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        expenses, // Support array of expenses
        missingCategories,
        timestamp: new Date(),
      };
      addMessage(message);
      return message;
    },
    [addMessage]
  );

  return {
    messages,
    setMessages,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    trackMessageUsage,
    checkUsageLimit,
  };
};
