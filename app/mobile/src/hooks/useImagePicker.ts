import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { logger } from '@/utils/logger';

interface ImageAsset {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
}

export const useImagePicker = () => {
  const [image, setImage] = useState<ImageAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const pickFromGallery = useCallback(async (): Promise<ImageAsset | null> => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        logger.warn('Gallery permission denied');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset: ImageAsset = {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: result.assets[0].mimeType,
          fileName: result.assets[0].fileName ?? undefined,
        };
        setImage(asset);
        return asset;
      }
      return null;
    } catch (error) {
      logger.error('Image pick failed', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const takePhoto = useCallback(async (): Promise<ImageAsset | null> => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        logger.warn('Camera permission denied');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset: ImageAsset = {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: result.assets[0].mimeType,
          fileName: result.assets[0].fileName ?? undefined,
        };
        setImage(asset);
        return asset;
      }
      return null;
    } catch (error) {
      logger.error('Camera capture failed', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearImage = useCallback(() => setImage(null), []);

  return { image, loading, pickFromGallery, takePhoto, clearImage };
};
