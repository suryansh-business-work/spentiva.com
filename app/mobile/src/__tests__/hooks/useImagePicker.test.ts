import { renderHook, act } from '@testing-library/react-native';
import { useImagePicker } from '@/hooks/useImagePicker';
import * as ImagePicker from 'expo-image-picker';

describe('useImagePicker', () => {
  beforeEach(() => jest.clearAllMocks());

  it('starts with null image and not loading', () => {
    const { result } = renderHook(() => useImagePicker());
    expect(result.current.image).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  describe('pickFromGallery', () => {
    it('returns null when permission denied', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });

      const { result } = renderHook(() => useImagePicker());

      let asset: unknown = undefined;
      await act(async () => {
        asset = await result.current.pickFromGallery();
      });

      expect(asset).toBeNull();
    });

    it('returns null when user cancels', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true, assets: [] });

      const { result } = renderHook(() => useImagePicker());

      let asset: unknown = undefined;
      await act(async () => {
        asset = await result.current.pickFromGallery();
      });

      expect(asset).toBeNull();
    });

    it('returns asset when image selected', async () => {
      const mockAsset = { uri: 'file://photo.jpg', width: 100, height: 100, mimeType: 'image/jpeg', fileName: 'photo.jpg' };
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [mockAsset],
      });

      const { result } = renderHook(() => useImagePicker());

      let asset: unknown = undefined;
      await act(async () => {
        asset = await result.current.pickFromGallery();
      });

      expect(asset).toEqual({
        uri: 'file://photo.jpg',
        width: 100,
        height: 100,
        type: 'image/jpeg',
        fileName: 'photo.jpg',
      });
      expect(result.current.image).not.toBeNull();
    });
  });

  describe('takePhoto', () => {
    it('returns null when camera permission denied', async () => {
      (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });

      const { result } = renderHook(() => useImagePicker());

      let asset: unknown = undefined;
      await act(async () => {
        asset = await result.current.takePhoto();
      });

      expect(asset).toBeNull();
    });
  });

  describe('clearImage', () => {
    it('resets image to null', async () => {
      const mockAsset = { uri: 'file://photo.jpg', width: 100, height: 100, mimeType: 'image/jpeg', fileName: 'photo.jpg' };
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [mockAsset],
      });

      const { result } = renderHook(() => useImagePicker());

      await act(async () => {
        await result.current.pickFromGallery();
      });
      expect(result.current.image).not.toBeNull();

      act(() => {
        result.current.clearImage();
      });
      expect(result.current.image).toBeNull();
    });
  });
});
