import { useThemeStore } from '@/contexts/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('themeStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useThemeStore.setState({ isDarkMode: false });
  });

  describe('initial state', () => {
    it('defaults to light mode', () => {
      expect(useThemeStore.getState().isDarkMode).toBe(false);
    });
  });

  describe('initialize', () => {
    it('loads saved theme from storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(true));

      await useThemeStore.getState().initialize();

      expect(useThemeStore.getState().isDarkMode).toBe(true);
    });

    it('keeps default when no saved theme', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await useThemeStore.getState().initialize();

      expect(useThemeStore.getState().isDarkMode).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      useThemeStore.getState().toggleTheme();

      expect(useThemeStore.getState().isDarkMode).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('themeMode', JSON.stringify(true));
    });

    it('toggles from dark to light', () => {
      useThemeStore.setState({ isDarkMode: true });

      useThemeStore.getState().toggleTheme();

      expect(useThemeStore.getState().isDarkMode).toBe(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('themeMode', JSON.stringify(false));
    });

    it('persists theme on each toggle', () => {
      useThemeStore.getState().toggleTheme();
      useThemeStore.getState().toggleTheme();

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });
});
