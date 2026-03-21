import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { ScreenHeader } from '@/components/ScreenHeader';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('ScreenHeader', () => {
  it('renders title', () => {
    const { getByText } = render(<ScreenHeader title="Dashboard" />, { wrapper: Wrapper });
    expect(getByText('Dashboard')).toBeTruthy();
  });

  it('renders without back button when no onBack', () => {
    const { queryByLabelText } = render(<ScreenHeader title="Home" />, { wrapper: Wrapper });
    expect(queryByLabelText('Back')).toBeNull();
  });
});
