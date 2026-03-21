import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Snackbar } from 'react-native-paper';

interface SnackbarContextValue {
  showSnackbar: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const useSnackbar = (): SnackbarContextValue => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showSnackbar = useCallback((msg: string, _type?: 'success' | 'error' | 'info') => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const onDismiss = useCallback(() => setVisible(false), []);

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={3000}
        action={{ label: 'Close', onPress: onDismiss }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
