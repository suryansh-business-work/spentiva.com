import { renderHook, act } from '@testing-library/react-native';
import { useLocation } from '@/hooks/useLocation';
import * as Location from 'expo-location';

describe('useLocation - permission flows', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('location permissions', () => {
    it('requests foreground permission before getting location', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
        coords: { latitude: 28.6, longitude: 77.2 },
      });
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useLocation());
      await act(async () => {
        await result.current.getCurrentLocation();
      });

      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('returns null when permission denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

      const { result } = renderHook(() => useLocation());
      let location: unknown;
      await act(async () => {
        location = await result.current.getCurrentLocation();
      });

      expect(location).toBeNull();
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
    });

    it('returns location when permission granted', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
        coords: { latitude: 28.6, longitude: 77.2 },
      });
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
        { street: 'Main St', city: 'Delhi', region: 'DL' },
      ]);

      const { result } = renderHook(() => useLocation());
      let location: unknown;
      await act(async () => {
        location = await result.current.getCurrentLocation();
      });

      expect(location).toEqual({
        latitude: 28.6,
        longitude: 77.2,
        address: 'Main St, Delhi, DL',
      });
    });

    it('returns location without address when reverse geocode returns empty', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
        coords: { latitude: 0, longitude: 0 },
      });
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useLocation());
      let location: unknown;
      await act(async () => {
        location = await result.current.getCurrentLocation();
      });

      expect(location).toEqual({
        latitude: 0,
        longitude: 0,
      });
    });

    it('updates location state after successful fetch', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
        coords: { latitude: 12.9, longitude: 77.6 },
      });
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
        { street: 'MG Road', city: 'Bangalore', region: 'KA' },
      ]);

      const { result } = renderHook(() => useLocation());
      await act(async () => {
        await result.current.getCurrentLocation();
      });

      expect(result.current.location).toEqual({
        latitude: 12.9,
        longitude: 77.6,
        address: 'MG Road, Bangalore, KA',
      });
    });

    it('returns null on error', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockRejectedValue(new Error('fail'));

      const { result } = renderHook(() => useLocation());
      let location: unknown;
      await act(async () => {
        location = await result.current.getCurrentLocation();
      });

      expect(location).toBeNull();
    });
  });

  describe('loading state', () => {
    it('starts with loading false', () => {
      const { result } = renderHook(() => useLocation());
      expect(result.current.loading).toBe(false);
    });

    it('resets loading after fetch', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
        coords: { latitude: 0, longitude: 0 },
      });
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useLocation());
      await act(async () => {
        await result.current.getCurrentLocation();
      });

      expect(result.current.loading).toBe(false);
    });
  });
});
