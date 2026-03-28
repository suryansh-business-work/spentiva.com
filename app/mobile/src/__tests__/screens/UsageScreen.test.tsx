import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { UsageScreen } from '@/screens/UsageScreen';
import { usageService } from '@/services';

jest.mock('@/services', () => ({
  usageService: {
    getOverview: jest.fn(),
  },
}));

const mockUsageService = usageService as jest.Mocked<typeof usageService>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('UsageScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders screen header', async () => {
    mockUsageService.getOverview.mockResolvedValue({
      success: true,
      data: null as never,
      message: 'OK',
      status: 200,
    });

    const { getAllByText } = render(<UsageScreen />, { wrapper: Wrapper });
    expect(getAllByText('Usage').length).toBeGreaterThanOrEqual(1);
  });

  it('renders usage data when available', async () => {
    mockUsageService.getOverview.mockResolvedValue({
      success: true,
      data: {
        totalMessages: 100,
        totalTokens: 5000,
        userMessages: 60,
        aiMessages: 40,
      },
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<UsageScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('100')).toBeTruthy();
      expect(getByText('5000')).toBeTruthy();
      expect(getByText('60')).toBeTruthy();
      expect(getByText('40')).toBeTruthy();
    });
  });

  it('shows error when data fetch fails', async () => {
    mockUsageService.getOverview.mockResolvedValue({
      success: false,
      data: null as never,
      message: 'No usage data available',
      status: 200,
    });

    const { getByText } = render(<UsageScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('No usage data available')).toBeTruthy();
    });
  });

  it('shows error view on API failure', async () => {
    mockUsageService.getOverview.mockResolvedValue({
      success: false,
      data: null as never,
      message: 'Failed to fetch usage',
      status: 500,
    });

    const { getByText } = render(<UsageScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('Failed to fetch usage')).toBeTruthy();
    });
  });

  it('renders message distribution section', async () => {
    mockUsageService.getOverview.mockResolvedValue({
      success: true,
      data: {
        totalMessages: 100,
        totalTokens: 5000,
        userMessages: 60,
        aiMessages: 40,
      },
      message: 'OK',
      status: 200,
    });

    const { getByText, getAllByText } = render(<UsageScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('Message Distribution')).toBeTruthy();
      expect(getAllByText('User Messages').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('AI Messages').length).toBeGreaterThanOrEqual(1);
    });
  });
});
