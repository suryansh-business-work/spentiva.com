import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { logger } from '@/utils/logger';

const MAX_DIMENSION = 1920;

interface ImageAsset {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
}

const resizeIfNeeded = async (uri: string, width: number, height: number) => {
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
    return { uri, width, height };
  }

  const resize =
    width > height
      ? { width: MAX_DIMENSION }
      : { height: MAX_DIMENSION };

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );

  return { uri: result.uri, width: result.width, height: result.height };
};

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
        const raw = result.assets[0];
        const resized = await resizeIfNeeded(raw.uri, raw.width, raw.height);
        const asset: ImageAsset = {
          uri: resized.uri,
          width: resized.width,
          height: resized.height,
          type: raw.mimeType,
          fileName: raw.fileName ?? undefined,
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
        const raw = result.assets[0];
        const resized = await resizeIfNeeded(raw.uri, raw.width, raw.height);
        const asset: ImageAsset = {
          uri: resized.uri,
          width: resized.width,
          height: resized.height,
          type: raw.mimeType,
          fileName: raw.fileName ?? undefined,
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
