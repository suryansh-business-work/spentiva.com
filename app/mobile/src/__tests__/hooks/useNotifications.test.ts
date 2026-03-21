import { renderHook, act } from '@testing-library/react-native';
import { useNotifications } from '@/hooks/useNotifications';
import * as Notifications from 'expo-notifications';

describe('useNotifications', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('registerForPushNotifications', () => {
    it('returns token when permissions granted', async () => {
      const { result } = renderHook(() => useNotifications());

      let token: string | null = null;
      await act(async () => {
        token = await result.current.registerForPushNotifications();
      });

      expect(token).toBe('test-token');
    });

    it('returns null when permission denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'denied' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'denied' });

      const { result } = renderHook(() => useNotifications());

      let token: string | null = null;
      await act(async () => {
        token = await result.current.registerForPushNotifications();
      });

      expect(token).toBeNull();
    });
  });

  describe('scheduleLocalNotification', () => {
    it('schedules a notification', async () => {
      const { result } = renderHook(() => useNotifications());

      await act(async () => {
        await result.current.scheduleLocalNotification('Title', 'Body', { key: 'val' });
      });

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: { title: 'Title', body: 'Body', data: { key: 'val' } },
        trigger: null,
      });
    });
  });

  describe('cleanup', () => {
    it('can be called without error', () => {
      const { result } = renderHook(() => useNotifications());
      expect(() => result.current.cleanup()).not.toThrow();
    });
  });
});
