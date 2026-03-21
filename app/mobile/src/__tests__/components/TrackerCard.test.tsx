import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { TrackerCard } from '@/components/TrackerCard';
import type { Tracker } from '@/types';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

const mockTracker: Tracker = {
  _id: 't1',
  name: 'My Trip',
  type: 'personal',
  currency: 'USD',
  description: 'Travel expenses',
  sharedWith: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('TrackerCard', () => {
  it('renders tracker name and type', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <TrackerCard tracker={mockTracker} onPress={onPress} />,
      { wrapper: Wrapper },
    );
    expect(getByText('My Trip')).toBeTruthy();
    expect(getByText('PERSONAL')).toBeTruthy();
    expect(getByText('USD')).toBeTruthy();
  });

  it('renders description when present', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <TrackerCard tracker={mockTracker} onPress={onPress} />,
      { wrapper: Wrapper },
    );
    expect(getByText('Travel expenses')).toBeTruthy();
  });

  it('calls onPress with tracker', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <TrackerCard tracker={mockTracker} onPress={onPress} />,
      { wrapper: Wrapper },
    );
    fireEvent.press(getByText('My Trip'));
    expect(onPress).toHaveBeenCalledWith(mockTracker);
  });

  it('renders business tracker type', () => {
    const onPress = jest.fn();
    const bizTracker = { ...mockTracker, type: 'business' as const };
    const { getByText } = render(
      <TrackerCard tracker={bizTracker} onPress={onPress} />,
      { wrapper: Wrapper },
    );
    expect(getByText('BUSINESS')).toBeTruthy();
  });
});
