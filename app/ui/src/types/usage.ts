// Usage & Usage Logs Type Definitions

export interface UsageOverview {
  overall: {
    totalMessages: number;
    totalTokens: number;
    userMessages: number;
    aiMessages: number;
  };
  byTracker: TrackerUsageSummary[];
  recentActivity: DailyUsageData[];
}

export interface TrackerUsageSummary {
  trackerId: string;
  trackerName: string;
  trackerType: string;
  isDeleted: boolean;
  deletedAt?: string;
  messageCount: number;
  tokenCount: number;
}

export interface DailyUsageData {
  label?: string;
  date?: string;
  messages?: number;
  messageCount?: number;
  tokens?: number;
  tokenCount?: number;
}

export interface UsageGraphs {
  dailyUsage: DailyUsageData[];
  byTrackerType: TrackerTypeDistribution[];
}

export interface TrackerTypeDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface TrackerStats {
  tracker: {
    trackerId: string;
    trackerName: string;
    trackerType: string;
    isDeleted: boolean;
    deletedAt?: string;
  };
  usage: {
    totalMessages: number;
    totalTokens: number;
    userMessages: number;
    aiMessages: number;
  };
  dailyUsage: DailyUsageData[];
  messages: UsageMessage[];
}

export interface TrackerGraphs {
  dailyUsage: DailyUsageData[];
  messageTypeDistribution: MessageTypeData[];
}

export interface MessageTypeData {
  type: string;
  count: number;
  percentage: number;
}

export interface UsageMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  tokenCount: number;
  timestamp: Date | string;
}

export interface UsageLog {
  _id: string;
  trackerSnapshot: {
    trackerId: string;
    trackerName: string;
    trackerType: string;
  };
  messageRole: 'user' | 'assistant';
  messageContent: string;
  tokenCount: number;
  timestamp: Date | string;
  createdAt?: Date | string;
}

export interface UsageLogsResponse {
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  logs: UsageLog[];
}

export interface CreateUsageLogRequest {
  trackerSnapshot: {
    trackerId: string;
    trackerName: string;
    trackerType: string;
  };
  messageRole: 'user' | 'assistant';
  messageContent: string;
  tokenCount: number;
  timestamp?: Date | string;
}
