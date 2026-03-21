import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { ErrorView } from '@/components/ErrorView';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('ErrorView', () => {
  it('renders default error message', () => {
    const { getByText } = render(<ErrorView />, { wrapper: Wrapper });
    expect(getByText('Oops!')).toBeTruthy();
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('renders custom error message', () => {
    const { getByText } = render(<ErrorView message="Server down" />, { wrapper: Wrapper });
    expect(getByText('Server down')).toBeTruthy();
  });

  it('shows retry button when onRetry provided', () => {
    const onRetry = jest.fn();
    const { getByText } = render(<ErrorView onRetry={onRetry} />, { wrapper: Wrapper });
    const retryBtn = getByText('Tap to retry');
    expect(retryBtn).toBeTruthy();
    fireEvent.press(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides retry button when no onRetry', () => {
    const { queryByText } = render(<ErrorView />, { wrapper: Wrapper });
    expect(queryByText('Tap to retry')).toBeNull();
  });
});
