import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { EmptyState } from '@/components/EmptyState';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('EmptyState', () => {
  it('renders title and description', () => {
    const { getByText } = render(
      <EmptyState title="No Data" description="There is nothing here yet." />,
      { wrapper: Wrapper }
    );
    expect(getByText('No Data')).toBeTruthy();
    expect(getByText('There is nothing here yet.')).toBeTruthy();
  });

  it('renders without description', () => {
    const { getByText, queryByText } = render(<EmptyState title="Empty" />, {
      wrapper: Wrapper,
    });
    expect(getByText('Empty')).toBeTruthy();
    expect(queryByText('There is nothing here yet.')).toBeNull();
  });
});
