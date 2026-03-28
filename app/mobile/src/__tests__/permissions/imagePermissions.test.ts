import { renderHook, act } from '@testing-library/react-native';
import { useImagePicker } from '@/hooks/useImagePicker';
import * as ImagePicker from 'expo-image-picker';

describe('useImagePicker - permission flows', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('gallery permissions', () => {
    it('requests media library permission before opening gallery', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true, assets: [] });

      const { result } = renderHook(() => useImagePicker());
      await act(async () => {
        await result.current.pickFromGallery();
      });

      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('does not open gallery when permission denied', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });

      const { result } = renderHook(() => useImagePicker());
      let asset: unknown;
      await act(async () => {
        asset = await result.current.pickFromGallery();
      });

      expect(asset).toBeNull();
      expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
    });

    it('opens gallery when permission granted', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true, assets: [] });

      const { result } = renderHook(() => useImagePicker());
      await act(async () => {
        await result.current.pickFromGallery();
      });

      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('camera permissions', () => {
    it('requests camera permission before launching camera', async () => {
      (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({ canceled: true, assets: [] });

      const { result } = renderHook(() => useImagePicker());
      await act(async () => {
        await result.current.takePhoto();
      });

      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('does not launch camera when permission denied', async () => {
      (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });

      const { result } = renderHook(() => useImagePicker());
      let asset: unknown;
      await act(async () => {
        asset = await result.current.takePhoto();
      });

      expect(asset).toBeNull();
      expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
    });

    it('launches camera when permission granted', async () => {
      (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({ canceled: true, assets: [] });

      const { result } = renderHook(() => useImagePicker());
      await act(async () => {
        await result.current.takePhoto();
      });

      expect(ImagePicker.launchCameraAsync).toHaveBeenCalledTimes(1);
    });

    it('returns asset from camera when photo taken', async () => {
      const mockAsset = {
        uri: 'file://camera-photo.jpg',
        width: 500,
        height: 300,
        mimeType: 'image/jpeg',
        fileName: 'camera.jpg',
      };
      (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [mockAsset],
      });

      const { result } = renderHook(() => useImagePicker());
      let asset: unknown;
      await act(async () => {
        asset = await result.current.takePhoto();
      });

      expect(asset).toEqual({
        uri: 'file://camera-photo.jpg',
        width: 500,
        height: 300,
        type: 'image/jpeg',
        fileName: 'camera.jpg',
      });
    });
  });

  describe('loading state', () => {
    it('sets loading true during gallery pick', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true, assets: [] });

      const { result } = renderHook(() => useImagePicker());
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.pickFromGallery();
      });

      expect(result.current.loading).toBe(false);
    });

    it('sets loading true during camera capture', async () => {
      (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({ canceled: true, assets: [] });

      const { result } = renderHook(() => useImagePicker());
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.takePhoto();
      });

      expect(result.current.loading).toBe(false);
    });
  });
});
