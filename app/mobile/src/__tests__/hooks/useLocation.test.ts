import { renderHook, act } from '@testing-library/react-native';
import { useLocation } from '@/hooks/useLocation';
import * as Location from 'expo-location';

describe('useLocation', () => {
  beforeEach(() => jest.clearAllMocks());

  it('starts with null location and not loading', () => {
    const { result } = renderHook(() => useLocation());
    expect(result.current.location).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('returns null when permission denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    const { result } = renderHook(() => useLocation());

    let loc: unknown = undefined;
    await act(async () => {
      loc = await result.current.getCurrentLocation();
    });

    expect(loc).toBeNull();
  });

  it('returns location data when granted', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 28.6139, longitude: 77.209 },
    });
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      { street: 'Main St', city: 'Delhi', region: 'DL' },
    ]);

    const { result } = renderHook(() => useLocation());

    let loc: unknown = undefined;
    await act(async () => {
      loc = await result.current.getCurrentLocation();
    });

    expect(loc).toEqual({
      latitude: 28.6139,
      longitude: 77.209,
      address: 'Main St, Delhi, DL',
    });
    expect(result.current.location).not.toBeNull();
  });

  it('handles empty reverse geocode', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 0, longitude: 0 },
    });
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useLocation());

    let loc: unknown = undefined;
    await act(async () => {
      loc = await result.current.getCurrentLocation();
    });

    expect(loc).toEqual({ latitude: 0, longitude: 0 });
  });
});
