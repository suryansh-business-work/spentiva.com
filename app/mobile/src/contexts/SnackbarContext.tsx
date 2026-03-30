import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Snackbar } from 'react-native-paper';

type SnackbarType = 'success' | 'error' | 'info';

const SNACKBAR_COLORS: Record<SnackbarType, string> = {
  success: '#16A34A',
  error: '#DC2626',
  info: '#2563EB',
};

interface SnackbarItem {
  message: string;
  type: SnackbarType;
}

interface SnackbarContextValue {
  showSnackbar: (message: string, type?: SnackbarType) => void;
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
  const [current, setCurrent] = useState<SnackbarItem>({ message: '', type: 'info' });
  const queue = useRef<SnackbarItem[]>([]);
  const isShowing = useRef(false);

  const showNext = useCallback(() => {
    if (queue.current.length === 0) {
      isShowing.current = false;
      return;
    }
    const next = queue.current.shift()!;
    setCurrent(next);
    setVisible(true);
    isShowing.current = true;
  }, []);

  const showSnackbar = useCallback((msg: string, type: SnackbarType = 'info') => {
    queue.current.push({ message: msg, type });
    if (!isShowing.current) showNext();
  }, [showNext]);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible && isShowing.current) {
      const timer = setTimeout(showNext, 200);
      return () => clearTimeout(timer);
    }
  }, [visible, showNext]);

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={3000}
        style={{ backgroundColor: SNACKBAR_COLORS[current.type] }}
        action={{ label: 'Close', onPress: onDismiss }}
      >
        {current.message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
