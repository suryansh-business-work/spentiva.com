import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { TrackerDetailScreen } from '@/screens/TrackerDetailScreen';
import { expenseService } from '@/services';

jest.mock('@/services', () => ({
  expenseService: {
    getAll: jest.fn(),
  },
}));

const mockExpenseService = expenseService as jest.Mocked<typeof expenseService>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('TrackerDetailScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders screen header with title', async () => {
    mockExpenseService.getAll.mockResolvedValue({
      success: true,
      data: { items: [], total: 0, page: 1, limit: 50, totalPages: 0 },
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<TrackerDetailScreen />, { wrapper: Wrapper });
    expect(getByText('Tracker')).toBeTruthy();
  });

  it('renders breadcrumb', async () => {
    mockExpenseService.getAll.mockResolvedValue({
      success: true,
      data: { items: [], total: 0, page: 1, limit: 50, totalPages: 0 },
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<TrackerDetailScreen />, { wrapper: Wrapper });
    expect(getByText('Trackers')).toBeTruthy();
    expect(getByText('Expenses')).toBeTruthy();
  });

  it('shows empty state when no expenses', async () => {
    mockExpenseService.getAll.mockResolvedValue({
      success: true,
      data: { items: [], total: 0, page: 1, limit: 50, totalPages: 0 },
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<TrackerDetailScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('No Expenses')).toBeTruthy();
    });
  });

  it('renders expenses when data available', async () => {
    mockExpenseService.getAll.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            _id: 'e1',
            trackerId: 'tracker-1',
            type: 'expense',
            amount: 50,
            category: 'Food',
            subcategory: '',
            categoryId: 'c1',
            paymentMethod: 'card',
            currency: 'USD',
            description: 'Lunch',
            timestamp: '2024-01-01',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
        total: 1,
        page: 1,
        limit: 50,
        totalPages: 1,
      },
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<TrackerDetailScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('Lunch')).toBeTruthy();
    });
  });

  it('shows error view on API failure', async () => {
    mockExpenseService.getAll.mockResolvedValue({
      success: false,
      data: null as never,
      message: 'Failed to load',
      status: 500,
    });

    const { getByText } = render(<TrackerDetailScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('Failed to load')).toBeTruthy();
    });
  });

  it('calls expenseService.getAll with trackerId', async () => {
    mockExpenseService.getAll.mockResolvedValue({
      success: true,
      data: { items: [], total: 0, page: 1, limit: 50, totalPages: 0 },
      message: 'OK',
      status: 200,
    });

    render(<TrackerDetailScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(mockExpenseService.getAll).toHaveBeenCalledWith('tracker-1', { page: 1, limit: 50 });
    });
  });
});
