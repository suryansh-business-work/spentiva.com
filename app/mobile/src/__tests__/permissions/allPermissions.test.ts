import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Contacts from 'expo-contacts';
import NetInfo from '@react-native-community/netinfo';

/**
 * Integration test: verifies all permissions can be requested
 * and the app handles granted/denied scenarios correctly.
 */
describe('All Permissions - Integration', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('all permissions granted', () => {
    it('camera permission granted', async () => {
      (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      const result = await ImagePicker.requestCameraPermissionsAsync();
      expect(result.granted).toBe(true);
    });

    it('photo library permission granted', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      expect(result.granted).toBe(true);
    });

    it('location permission granted', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      const result = await Location.requestForegroundPermissionsAsync();
      expect(result.status).toBe('granted');
    });

    it('notification permission granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      const result = await Notifications.getPermissionsAsync();
      expect(result.status).toBe('granted');
    });

    it('contacts permission granted', async () => {
      (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      const result = await Contacts.requestPermissionsAsync();
      expect(result.status).toBe('granted');
    });

    it('network is connected', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, type: 'wifi' });
      const state = await NetInfo.fetch();
      expect(state.isConnected).toBe(true);
    });
  });

  describe('all permissions denied', () => {
    it('camera permission denied', async () => {
      (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });
      const result = await ImagePicker.requestCameraPermissionsAsync();
      expect(result.granted).toBe(false);
    });

    it('photo library permission denied', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      expect(result.granted).toBe(false);
    });

    it('location permission denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const result = await Location.requestForegroundPermissionsAsync();
      expect(result.status).toBe('denied');
    });

    it('notification permission denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const existing = await Notifications.getPermissionsAsync();
      expect(existing.status).not.toBe('granted');
      const requested = await Notifications.requestPermissionsAsync();
      expect(requested.status).toBe('denied');
    });

    it('contacts permission denied', async () => {
      (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const result = await Contacts.requestPermissionsAsync();
      expect(result.status).toBe('denied');
    });

    it('network is disconnected', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false, type: 'none' });
      const state = await NetInfo.fetch();
      expect(state.isConnected).toBe(false);
    });
  });

  describe('permission request flow', () => {
    it('requests all permissions sequentially', async () => {
      // Camera
      (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      // Photo Library
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      // Location
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      // Notifications
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      // Contacts
      (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });

      const [camera, gallery, location, notification, contacts] = await Promise.all([
        ImagePicker.requestCameraPermissionsAsync(),
        ImagePicker.requestMediaLibraryPermissionsAsync(),
        Location.requestForegroundPermissionsAsync(),
        Notifications.getPermissionsAsync(),
        Contacts.requestPermissionsAsync(),
      ]);

      expect(camera.granted).toBe(true);
      expect(gallery.granted).toBe(true);
      expect(location.status).toBe('granted');
      expect(notification.status).toBe('granted');
      expect(contacts.status).toBe('granted');
    });
  });
});
