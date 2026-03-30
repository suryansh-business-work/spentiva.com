/**
 * Edge case tests for SnackbarContext.
 * Tests message queue, type-based colors, rapid firing, and dismiss behavior.
 */
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { SnackbarProvider, useSnackbar } from '@/contexts/SnackbarContext';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { Text, Pressable } from 'react-native';

// Mock Snackbar to capture style and visibility
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const React = require('react');
  const RN = require('react-native');
  return {
    ...actual,
    Snackbar: ({
      visible,
      children,
      style,
      onDismiss,
    }: {
      visible: boolean;
      children: React.ReactNode;
      style?: Record<string, unknown>;
      onDismiss: () => void;
    }) =>
      visible
        ? React.createElement(
            RN.View,
            { testID: 'snackbar' },
            React.createElement(RN.Text, { testID: 'snackbar-message' }, children),
            style?.backgroundColor
              ? React.createElement(RN.Text, { testID: 'snackbar-color' }, String(style.backgroundColor))
              : null,
            React.createElement(
              RN.Pressable,
              { testID: 'snackbar-dismiss', onPress: onDismiss },
              React.createElement(RN.Text, null, 'Dismiss'),
            ),
          )
        : null,
  };
});

const { View: RNView } = require('react-native');

const TypedTrigger: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  return (
    <RNView>
      <Pressable onPress={() => showSnackbar('Success msg', 'success')} testID="success-btn">
        <Text>Success</Text>
      </Pressable>
      <Pressable onPress={() => showSnackbar('Error msg', 'error')} testID="error-btn">
        <Text>Error</Text>
      </Pressable>
      <Pressable onPress={() => showSnackbar('Info msg', 'info')} testID="info-btn">
        <Text>Info</Text>
      </Pressable>
      <Pressable onPress={() => showSnackbar('Default msg')} testID="default-btn">
        <Text>Default</Text>
      </Pressable>
    </RNView>
  );
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>
    <SnackbarProvider>{children}</SnackbarProvider>
  </PaperProvider>
);

describe('SnackbarContext - Edge Cases', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('applies success color for success type', async () => {
    const { getByTestId } = render(<TypedTrigger />, { wrapper: Wrapper });

    fireEvent.press(getByTestId('success-btn'));

    await waitFor(() => {
      expect(getByTestId('snackbar-message').props.children).toBe('Success msg');
    });

    expect(getByTestId('snackbar-color').props.children).toBe('#16A34A');
  });

  it('applies error color for error type', async () => {
    const { getByTestId } = render(<TypedTrigger />, { wrapper: Wrapper });

    fireEvent.press(getByTestId('error-btn'));

    await waitFor(() => {
      expect(getByTestId('snackbar-message').props.children).toBe('Error msg');
    });

    expect(getByTestId('snackbar-color').props.children).toBe('#DC2626');
  });

  it('applies info color for info type', async () => {
    const { getByTestId } = render(<TypedTrigger />, { wrapper: Wrapper });

    fireEvent.press(getByTestId('info-btn'));

    await waitFor(() => {
      expect(getByTestId('snackbar-message').props.children).toBe('Info msg');
    });

    expect(getByTestId('snackbar-color').props.children).toBe('#2563EB');
  });

  it('defaults to info color when no type specified', async () => {
    const { getByTestId } = render(<TypedTrigger />, { wrapper: Wrapper });

    fireEvent.press(getByTestId('default-btn'));

    await waitFor(() => {
      expect(getByTestId('snackbar-message').props.children).toBe('Default msg');
    });

    expect(getByTestId('snackbar-color').props.children).toBe('#2563EB');
  });

  it('queues messages and shows them sequentially', async () => {
    const { getByTestId } = render(<TypedTrigger />, { wrapper: Wrapper });

    // Fire multiple messages rapidly
    fireEvent.press(getByTestId('success-btn'));
    fireEvent.press(getByTestId('error-btn'));

    // First message should show
    await waitFor(() => {
      expect(getByTestId('snackbar-message').props.children).toBe('Success msg');
    });

    // Dismiss first
    fireEvent.press(getByTestId('snackbar-dismiss'));

    // Wait for queue processing delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Second message should appear
    await waitFor(() => {
      expect(getByTestId('snackbar-message').props.children).toBe('Error msg');
    });
  });

  it('handles empty string message', async () => {
    const EmptyTrigger: React.FC = () => {
      const { showSnackbar } = useSnackbar();
      return (
        <Pressable onPress={() => showSnackbar('', 'info')} testID="empty-btn">
          <Text>Empty</Text>
        </Pressable>
      );
    };

    const { getByTestId } = render(<EmptyTrigger />, { wrapper: Wrapper });
    fireEvent.press(getByTestId('empty-btn'));

    await waitFor(() => {
      expect(getByTestId('snackbar')).toBeTruthy();
    });
  });
});
