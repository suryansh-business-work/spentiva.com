import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { StatCard } from '@/components/StatCard';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('StatCard', () => {
  it('renders label and value', () => {
    const { getByText } = render(
      <StatCard icon="cash" label="Total" value="$500" />,
      { wrapper: Wrapper },
    );
    expect(getByText('Total')).toBeTruthy();
    expect(getByText('$500')).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { getByText } = render(
      <StatCard icon="trending-up" label="Income" value="$1,200" color="#10B981" />,
      { wrapper: Wrapper },
    );
    expect(getByText('Income')).toBeTruthy();
    expect(getByText('$1,200')).toBeTruthy();
  });
});
