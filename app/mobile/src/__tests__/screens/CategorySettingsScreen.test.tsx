import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { CategorySettingsScreen } from '@/screens/CategorySettingsScreen';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn() }),
    useRoute: () => ({ params: { trackerId: 'tracker1' } }),
  };
});

jest.mock('@/services', () => ({
  categoryService: {
    getAll: jest.fn().mockResolvedValue({ success: true, data: [] }),
    delete: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('@/contexts', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('CategorySettingsScreen', () => {
  it('renders screen header', () => {
    const { getAllByText } = render(<CategorySettingsScreen />, { wrapper: Wrapper });
    expect(getAllByText('Categories').length).toBeGreaterThanOrEqual(1);
  });

  it('renders breadcrumb with Trackers parent', () => {
    const { getByText } = render(<CategorySettingsScreen />, { wrapper: Wrapper });
    expect(getByText('Trackers')).toBeTruthy();
  });

  it('renders empty state when no categories', async () => {
    const { getByText } = render(<CategorySettingsScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('No Categories')).toBeTruthy();
    });
  });
});
