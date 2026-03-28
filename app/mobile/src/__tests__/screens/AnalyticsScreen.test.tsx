import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { AnalyticsScreen } from '@/screens/AnalyticsScreen';
import { analyticsService } from '@/services';

jest.mock('@/services', () => ({
  analyticsService: {
    getSummary: jest.fn(),
    getByCategory: jest.fn(),
  },
}));

const mockAnalyticsService = analyticsService as jest.Mocked<typeof analyticsService>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('AnalyticsScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders screen header', async () => {
    mockAnalyticsService.getSummary.mockResolvedValue({
      success: true,
      data: null as never,
      message: 'OK',
      status: 200,
    });
    mockAnalyticsService.getByCategory.mockResolvedValue({
      success: true,
      data: [],
      message: 'OK',
      status: 200,
    });

    const { getAllByText } = render(<AnalyticsScreen />, { wrapper: Wrapper });
    expect(getAllByText('Analytics').length).toBeGreaterThanOrEqual(1);
  });

  it('renders filter chips', async () => {
    mockAnalyticsService.getSummary.mockResolvedValue({
      success: true,
      data: null as never,
      message: 'OK',
      status: 200,
    });
    mockAnalyticsService.getByCategory.mockResolvedValue({
      success: true,
      data: [],
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<AnalyticsScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('Today')).toBeTruthy();
      expect(getByText('This Week')).toBeTruthy();
      expect(getByText('This Month')).toBeTruthy();
      expect(getByText('This Year')).toBeTruthy();
      expect(getByText('All Time')).toBeTruthy();
    });
  });

  it('renders analytics data when available', async () => {
    mockAnalyticsService.getSummary.mockResolvedValue({
      success: true,
      data: {
        totalExpenses: 500,
        totalIncome: 1000,
        netBalance: 500,
        transactionCount: 10,
        averageExpense: 50,
        averageIncome: 100,
      },
      message: 'OK',
      status: 200,
    });
    mockAnalyticsService.getByCategory.mockResolvedValue({
      success: true,
      data: [
        { category: 'Food', amount: 200, count: 5, percentage: 40 },
      ],
      message: 'OK',
      status: 200,
    });

    const { getAllByText, getByText } = render(<AnalyticsScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getAllByText('$500').length).toBeGreaterThanOrEqual(1);
      expect(getByText('$1000')).toBeTruthy();
      expect(getByText('Food')).toBeTruthy();
    });
  });

  it('shows error view when summary fails', async () => {
    mockAnalyticsService.getSummary.mockResolvedValue({
      success: false,
      data: null as never,
      message: 'No summary data',
      status: 200,
    });
    mockAnalyticsService.getByCategory.mockResolvedValue({
      success: true,
      data: [],
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<AnalyticsScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('No summary data')).toBeTruthy();
    });
  });

  it('shows error view on API failure', async () => {
    mockAnalyticsService.getSummary.mockResolvedValue({
      success: false,
      data: null as never,
      message: 'Analytics failed',
      status: 500,
    });
    mockAnalyticsService.getByCategory.mockResolvedValue({
      success: true,
      data: [],
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<AnalyticsScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('Analytics failed')).toBeTruthy();
    });
  });
});
