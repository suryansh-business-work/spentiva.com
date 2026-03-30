import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { ProfileScreen } from '@/screens/ProfileScreen';

jest.mock('@/contexts', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      user: { _id: '1', firstName: 'Test', lastName: 'User', email: 'test@test.com', isVerified: true, mfaEnabled: false, roleSlug: 'user' },
      updateUser: jest.fn(),
      logout: jest.fn(),
    }),
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('ProfileScreen', () => {
  it('renders screen header', () => {
    const { getAllByText } = render(<ProfileScreen />, { wrapper: Wrapper });
    expect(getAllByText('Profile').length).toBeGreaterThanOrEqual(1);
  });

  it('renders breadcrumb with More parent', () => {
    const { getByText } = render(<ProfileScreen />, { wrapper: Wrapper });
    expect(getByText('More')).toBeTruthy();
  });

  it('renders user name and email', () => {
    const { getByText } = render(<ProfileScreen />, { wrapper: Wrapper });
    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('test@test.com')).toBeTruthy();
  });

  it('renders profile form fields', () => {
    const { getAllByText } = render(<ProfileScreen />, { wrapper: Wrapper });
    expect(getAllByText('First Name').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Last Name').length).toBeGreaterThanOrEqual(1);
  });

  it('renders save and logout buttons', () => {
    const { getByText } = render(<ProfileScreen />, { wrapper: Wrapper });
    expect(getByText('Save Changes')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
  });
});
