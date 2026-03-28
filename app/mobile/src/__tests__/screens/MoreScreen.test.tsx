import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { MoreScreen } from '@/screens/MoreScreen';

const mockLogout = jest.fn();
const mockToggleTheme = jest.fn();

jest.mock('@/contexts', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      user: { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@test.com' },
      logout: mockLogout,
    }),
  useThemeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ isDarkMode: false, toggleTheme: mockToggleTheme }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('MoreScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders screen header', () => {
    const { getAllByText } = render(<MoreScreen />, { wrapper: Wrapper });
    expect(getAllByText('More').length).toBeGreaterThanOrEqual(1);
  });

  it('renders user profile info', () => {
    const { getByText } = render(<MoreScreen />, { wrapper: Wrapper });
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@test.com')).toBeTruthy();
  });

  it('renders user initials avatar', () => {
    const { getByText } = render(<MoreScreen />, { wrapper: Wrapper });
    expect(getByText('JD')).toBeTruthy();
  });

  it('renders menu items', () => {
    const { getByText } = render(<MoreScreen />, { wrapper: Wrapper });
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Billing')).toBeTruthy();
    expect(getByText('Support')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Dark Mode')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
  });

  it('navigates to Profile on press', () => {
    const mockNavigate = (globalThis as unknown as Record<string, jest.Mock>).__mockNavigate;
    const { getByText } = render(<MoreScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  });

  it('navigates to Billing on press', () => {
    const mockNavigate = (globalThis as unknown as Record<string, jest.Mock>).__mockNavigate;
    const { getByText } = render(<MoreScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Billing'));
    expect(mockNavigate).toHaveBeenCalledWith('Billing');
  });

  it('navigates to Support on press', () => {
    const mockNavigate = (globalThis as unknown as Record<string, jest.Mock>).__mockNavigate;
    const { getByText } = render(<MoreScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Support'));
    expect(mockNavigate).toHaveBeenCalledWith('Support');
  });

  it('navigates to Settings on press', () => {
    const mockNavigate = (globalThis as unknown as Record<string, jest.Mock>).__mockNavigate;
    const { getByText } = render(<MoreScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Settings'));
    expect(mockNavigate).toHaveBeenCalledWith('Settings');
  });

  it('calls toggleTheme on dark mode press', () => {
    const { getByText } = render(<MoreScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Dark Mode'));
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('calls logout on logout press', () => {
    const { getByText } = render(<MoreScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
