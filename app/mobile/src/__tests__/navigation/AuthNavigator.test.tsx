import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { AuthNavigator } from '@/navigation/AuthNavigator';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('AuthNavigator', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<AuthNavigator />, { wrapper: Wrapper });
    expect(toJSON()).toBeTruthy();
  });
});
