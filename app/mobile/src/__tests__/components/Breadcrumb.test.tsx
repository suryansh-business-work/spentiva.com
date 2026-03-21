import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { Breadcrumb } from '@/components/Breadcrumb';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('Breadcrumb', () => {
  it('renders all items', () => {
    const items = [
      { label: 'Home', onPress: jest.fn() },
      { label: 'Settings' },
    ];
    const { getByText } = render(<Breadcrumb items={items} />, { wrapper: Wrapper });
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders single item without separator', () => {
    const { getByText, queryAllByText } = render(
      <Breadcrumb items={[{ label: 'Dashboard' }]} />,
      { wrapper: Wrapper },
    );
    expect(getByText('Dashboard')).toBeTruthy();
    // No chevron should be rendered for single item
    expect(queryAllByText('chevron-right')).toHaveLength(0);
  });
});
