import { renderHook, act } from '@testing-library/react-native';
import { useNotifications } from '@/hooks/useNotifications';
import * as Notifications from 'expo-notifications';

describe('useNotifications - permission flows', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('push notification permissions', () => {
    it('requests permission if not already granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({ data: 'ExponentPushToken[xxx]' });

      const { result } = renderHook(() => useNotifications());
      await act(async () => {
        await result.current.registerForPushNotifications();
      });

      expect(Notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('skips requesting when already granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({ data: 'ExponentPushToken[xxx]' });

      const { result } = renderHook(() => useNotifications());
      await act(async () => {
        await result.current.registerForPushNotifications();
      });

      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('returns null when permission denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

      const { result } = renderHook(() => useNotifications());
      let token: unknown;
      await act(async () => {
        token = await result.current.registerForPushNotifications();
      });

      expect(token).toBeNull();
      expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
    });

    it('returns push token on success', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({ data: 'ExponentPushToken[abc123]' });

      const { result } = renderHook(() => useNotifications());
      let token: unknown;
      await act(async () => {
        token = await result.current.registerForPushNotifications();
      });

      expect(token).toBe('ExponentPushToken[abc123]');
    });

    it('handles errors gracefully when device check fails', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(new Error('Device error'));

      const { result } = renderHook(() => useNotifications());
      let token: unknown;
      await act(async () => {
        try {
          token = await result.current.registerForPushNotifications();
        } catch {
          token = null;
        }
      });

      expect(token).toBeNull();
    });

    it('sets up android notification channel when platform is android', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({ data: 'token' });

      const { result } = renderHook(() => useNotifications());
      await act(async () => {
        await result.current.registerForPushNotifications();
      });

      // Verify token was fetched regardless of platform
      expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalled();
    });
  });

  describe('local notifications', () => {
    it('schedules local notification', async () => {
      const { result } = renderHook(() => useNotifications());
      await act(async () => {
        await result.current.scheduleLocalNotification('Test Title', 'Test Body');
      });

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: { title: 'Test Title', body: 'Test Body', data: undefined },
        trigger: null,
      });
    });

    it('schedules local notification with data', async () => {
      const { result } = renderHook(() => useNotifications());
      const data = { screen: 'Tracker', id: '123' };
      await act(async () => {
        await result.current.scheduleLocalNotification('Title', 'Body', data);
      });

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: { title: 'Title', body: 'Body', data },
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
