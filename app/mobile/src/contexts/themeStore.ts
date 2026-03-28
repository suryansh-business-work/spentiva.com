import { create } from 'zustand';
import { getThemeMode, setThemeMode } from '@/utils/storage';

interface ThemeState {
  isDarkMode: boolean;
}

interface ThemeActions {
  toggleTheme: () => void;
  initialize: () => Promise<void>;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDarkMode: false,

  initialize: async () => {
    try {
      const saved = await getThemeMode();
      if (saved !== null) {
        set({ isDarkMode: saved });
      }
    } catch {
      // Fallback to default theme on storage failure
    }
  },

  toggleTheme: () => {
    const next = !get().isDarkMode;
    set({ isDarkMode: next });
    setThemeMode(next);
  },
}));
