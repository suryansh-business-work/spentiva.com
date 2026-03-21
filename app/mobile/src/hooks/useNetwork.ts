import { useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface NetworkState {
  isConnected: boolean | null;
  type: string | null;
}

export const useNetwork = () => {
  const [network, setNetwork] = useState<NetworkState>({
    isConnected: true,
    type: null,
  });

  const checkConnection = useCallback(async () => {
    const state = await NetInfo.fetch();
    setNetwork({
      isConnected: state.isConnected,
      type: state.type,
    });
    return state.isConnected;
  }, []);

  return { ...network, checkConnection };
};
