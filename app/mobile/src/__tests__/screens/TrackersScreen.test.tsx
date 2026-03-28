import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { TrackersScreen } from '@/screens/TrackersScreen';
import { trackerService } from '@/services';

jest.mock('@/services', () => ({
  trackerService: {
    getAll: jest.fn(),
  },
}));

const mockTrackerService = trackerService as jest.Mocked<typeof trackerService>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('TrackersScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders screen header with title', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: true,
      data: [],
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<TrackersScreen />, { wrapper: Wrapper });
    expect(getByText('Trackers')).toBeTruthy();
  });

  it('renders search bar', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: true,
      data: [],
      message: 'OK',
      status: 200,
    });

    const { getByPlaceholderText } = render(<TrackersScreen />, { wrapper: Wrapper });
    expect(getByPlaceholderText('Search trackers...')).toBeTruthy();
  });

  it('shows empty state when no trackers', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: true,
      data: [],
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<TrackersScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('No Trackers Yet')).toBeTruthy();
    });
  });

  it('renders tracker list when data available', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: true,
      data: [
        {
          _id: 't1',
          name: 'Trip Tracker',
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

    const { getByText } = render(<TrackersScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('Trip Tracker')).toBeTruthy();
    });
  });

  it('shows error view on API failure', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: false,
      data: null as never,
      message: 'Network error',
      status: 500,
    });

    const { getByText } = render(<TrackersScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('Network error')).toBeTruthy();
    });
  });

  it('calls getAll on mount', async () => {
    mockTrackerService.getAll.mockResolvedValue({
      success: true,
      data: [],
      message: 'OK',
      status: 200,
    });

    render(<TrackersScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(mockTrackerService.getAll).toHaveBeenCalledTimes(1);
    });
  });
});
