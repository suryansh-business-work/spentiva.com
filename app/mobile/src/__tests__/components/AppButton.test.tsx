import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { AppButton } from '@/components/AppButton';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('AppButton', () => {
  it('renders with title', () => {
    const { getByText } = render(
      <AppButton title="Test Button" mode="contained" onPress={() => {}} />,
      { wrapper: Wrapper }
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders in disabled state', () => {
    const { getByText } = render(
      <AppButton title="Disabled" mode="contained" disabled onPress={() => {}} />,
      { wrapper: Wrapper }
    );
    expect(getByText('Disabled')).toBeTruthy();
  });
});
