import { renderHook, act } from '@testing-library/react-native';
import { useNetwork } from '@/hooks/useNetwork';
import NetInfo from '@react-native-community/netinfo';

describe('useNetwork - network connectivity', () => {
  beforeEach(() => jest.clearAllMocks());

  it('starts with connected state', () => {
    const { result } = renderHook(() => useNetwork());
    expect(result.current.isConnected).toBe(true);
  });

  it('checks connection and updates state', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: true,
      type: 'wifi',
    });

    const { result } = renderHook(() => useNetwork());
    let connected: unknown;
    await act(async () => {
      connected = await result.current.checkConnection();
    });

    expect(connected).toBe(true);
    expect(result.current.isConnected).toBe(true);
    expect(result.current.type).toBe('wifi');
  });

  it('detects disconnected state', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: false,
      type: 'none',
    });

    const { result } = renderHook(() => useNetwork());
    let connected: unknown;
    await act(async () => {
      connected = await result.current.checkConnection();
    });

    expect(connected).toBe(false);
    expect(result.current.isConnected).toBe(false);
    expect(result.current.type).toBe('none');
  });

  it('detects cellular connection', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({
      isConnected: true,
      type: 'cellular',
    });

    const { result } = renderHook(() => useNetwork());
    await act(async () => {
      await result.current.checkConnection();
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.type).toBe('cellular');
  });
});
