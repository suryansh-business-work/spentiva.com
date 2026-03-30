import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { FormInput } from '@/components/FormInput';

// Mock TextInput to avoid Animated renderer version mismatch
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const React = require('react');
  const { View, TextInput: RNTextInput } = require('react-native');
  return {
    ...actual,
    TextInput: ({ label, error: _error, ...props }: { label?: string; error?: boolean; [k: string]: unknown }) =>
      React.createElement(View, null,
        label ? React.createElement(require('react-native').Text, null, label) : null,
        React.createElement(RNTextInput, props),
      ),
    HelperText: ({ children, visible }: { children: React.ReactNode; visible?: boolean }) =>
      visible ? React.createElement(require('react-native').Text, null, children) : null,
  };
});

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('FormInput', () => {
  it('renders with label', () => {
    const { getByText } = render(<FormInput label="Email" />, { wrapper: Wrapper });
    expect(getByText('Email')).toBeTruthy();
  });

  it('does not show error when not touched', () => {
    const { queryByText } = render(
      <FormInput label="Name" error="Required" touched={false} />,
      { wrapper: Wrapper },
    );
    expect(queryByText('Required')).toBeNull();
  });

  it('shows error when touched and has error', () => {
    const { getByText } = render(
      <FormInput label="Name" error="Required" touched={true} />,
      { wrapper: Wrapper },
    );
    expect(getByText('Required')).toBeTruthy();
  });

  it('does not show error when touched but no error', () => {
    const { queryByText } = render(
      <FormInput label="Name" touched={true} />,
      { wrapper: Wrapper },
    );
    expect(queryByText('Required')).toBeNull();
  });
});
