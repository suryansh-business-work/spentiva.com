import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SnackbarProvider, useSnackbar } from '@/contexts/SnackbarContext';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { Text, Pressable } from 'react-native';

// Mock Snackbar to avoid Animated renderer version mismatch
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const React = require('react');
  return {
    ...actual,
    Snackbar: ({ visible, children }: { visible: boolean; children: React.ReactNode }) =>
      visible ? React.createElement(require('react-native').Text, null, children) : null,
  };
});

const TestConsumer: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  return (
    <Pressable onPress={() => showSnackbar('Test message')} testID="trigger">
      <Text>Trigger</Text>
    </Pressable>
  );
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>
    <SnackbarProvider>{children}</SnackbarProvider>
  </PaperProvider>
);

describe('SnackbarContext', () => {
  it('renders children', () => {
    const { getByText } = render(
      <TestWrapper>
        <Text>Hello</Text>
      </TestWrapper>,
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it('shows snackbar message when triggered', async () => {
    const { getByTestId, getByText } = render(
      <TestWrapper>
        <TestConsumer />
      </TestWrapper>,
    );

    fireEvent.press(getByTestId('trigger'));

    await waitFor(() => {
      expect(getByText('Test message')).toBeTruthy();
    });
  });

  it('throws when used outside provider', () => {
    const ErrorComponent = () => {
      useSnackbar();
      return null;
    };

    expect(() =>
      render(
        <PaperProvider theme={lightTheme}>
          <ErrorComponent />
        </PaperProvider>,
      ),
    ).toThrow('useSnackbar must be used within SnackbarProvider');
  });
});
