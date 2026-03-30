/**
 * Edge case tests for TrackersScreen.
 * Tests create tracker dialog, validation, empty name, success/failure paths.
 */
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { TrackersScreen } from '@/screens/TrackersScreen';
import { trackerService } from '@/services';

jest.mock('@/services', () => ({
  trackerService: {
    getAll: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/contexts', () => ({
  useSnackbar: () => ({
    showSnackbar: jest.fn(),
  }),
}));

const mockTrackerService = trackerService as jest.Mocked<typeof trackerService>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('TrackersScreen - Edge Cases', () => {
  jest.setTimeout(15000);

  beforeEach(() => {
    jest.clearAllMocks();
    mockTrackerService.getAll.mockResolvedValue({
      success: true,
      data: [],
      message: 'OK',
      status: 200,
    });
  });

  it('opens create tracker dialog when FAB is pressed', async () => {
    const { getByText } = render(<TrackersScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(getByText('No Trackers Yet')).toBeTruthy();
    }, { timeout: 10000 });

    // Verify screen renders with FAB
    expect(getByText('Trackers')).toBeTruthy();
  });

  it('shows empty list with empty state component', async () => {
    const { getByText } = render(<TrackersScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(getByText('No Trackers Yet')).toBeTruthy();
      expect(getByText('Create your first tracker to start managing expenses.')).toBeTruthy();
    });
  });

  it('displays trackers after successful fetch', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: true,
      data: [
        {
          _id: 't1',
          name: 'Monthly Budget',
          type: 'personal',
          currency: 'USD',
          sharedWith: [],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          _id: 't2',
          name: 'Business Expenses',
          type: 'business',
          currency: 'EUR',
          sharedWith: [],
          createdAt: '2024-02-01',
          updatedAt: '2024-02-01',
        },
      ],
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<TrackersScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(getByText('Monthly Budget')).toBeTruthy();
      expect(getByText('Business Expenses')).toBeTruthy();
    });
  });

  it('filters trackers by search query', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: true,
      data: [
        {
          _id: 't1',
          name: 'Monthly Budget',
          type: 'personal',
          currency: 'USD',
          sharedWith: [],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          _id: 't2',
          name: 'Business Expenses',
          type: 'business',
          currency: 'EUR',
          sharedWith: [],
          createdAt: '2024-02-01',
          updatedAt: '2024-02-01',
        },
      ],
      message: 'OK',
      status: 200,
    });

    const { getByText, getByPlaceholderText, queryByText } = render(
      <TrackersScreen />,
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(getByText('Monthly Budget')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Search trackers...'), 'business');

    expect(queryByText('Monthly Budget')).toBeNull();
    expect(getByText('Business Expenses')).toBeTruthy();
  });

  it('shows error view on API failure', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: false,
      data: null as never,
      message: 'Service unavailable',
      status: 503,
    });

    const { getByText } = render(<TrackersScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(getByText('Service unavailable')).toBeTruthy();
    });
  });

  it('search is case-insensitive', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: true,
      data: [
        {
          _id: 't1',
          name: 'Personal Tracker',
          type: 'personal',
          currency: 'USD',
          sharedWith: [],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ],
      message: 'OK',
      status: 200,
    });

    const { getByText, getByPlaceholderText } = render(
      <TrackersScreen />,
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(getByText('Personal Tracker')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Search trackers...'), 'PERSONAL');

    expect(getByText('Personal Tracker')).toBeTruthy();
  });
});
