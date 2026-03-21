import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import { logger } from '@/utils/logger';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        logger.warn('Location permission denied');
        return null;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const data: LocationData = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };

      const [address] = await Location.reverseGeocodeAsync({
        latitude: data.latitude,
        longitude: data.longitude,
      });

      if (address) {
        data.address = [address.street, address.city, address.region]
          .filter(Boolean)
          .join(', ');
      }

      setLocation(data);
      return data;
    } catch (error) {
      logger.error('Location fetch failed', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, getCurrentLocation };
};
