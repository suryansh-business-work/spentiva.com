import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { LoadingOverlay } from '@/components/LoadingOverlay';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('LoadingOverlay', () => {
  it('renders nothing when not visible', () => {
    const { queryByTestId, queryByText } = render(<LoadingOverlay visible={false} />, { wrapper: Wrapper });
    // When not visible, component returns null — no ActivityIndicator or message rendered
    expect(queryByText('Loading data...')).toBeNull();
    expect(queryByTestId('loading-indicator')).toBeNull();
  });

  it('renders activity indicator when visible', () => {
    const { UNSAFE_queryAllByType } = render(<LoadingOverlay visible={true} />, { wrapper: Wrapper });
    const { ActivityIndicator } = require('react-native');
    const indicators = UNSAFE_queryAllByType(ActivityIndicator);
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('shows message when provided', () => {
    const { getByText } = render(
      <LoadingOverlay visible={true} message="Loading data..." />,
      { wrapper: Wrapper },
    );
    expect(getByText('Loading data...')).toBeTruthy();
  });

  it('hides message when not provided', () => {
    const { queryByText } = render(<LoadingOverlay visible={true} />, { wrapper: Wrapper });
    expect(queryByText('Loading data...')).toBeNull();
  });
});
