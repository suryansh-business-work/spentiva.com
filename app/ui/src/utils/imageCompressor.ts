const MAX_DIMENSION = 1920;
const DEFAULT_QUALITY = 0.8;

/**
 * Compresses and resizes an image file if it exceeds MAX_DIMENSION pixels.
 * Returns the original file if it's not an image.
 */
export const compressImage = (
  file: File,
  maxDimension: number = MAX_DIMENSION,
  quality: number = DEFAULT_QUALITY
): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    // SVGs don't need compression
    if (file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;

      // If already within limits, return original
      if (width <= maxDimension && height <= maxDimension) {
        resolve(file);
        return;
      }

      // Calculate new dimensions maintaining aspect ratio
      let newWidth = width;
      let newHeight = height;

      if (width > height) {
        newWidth = maxDimension;
        newHeight = Math.round((height / width) * maxDimension);
      } else {
        newHeight = maxDimension;
        newWidth = Math.round((width / height) * maxDimension);
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

      canvas.toBlob(
        blob => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressedFile = new File([blob], file.name, {
            type: outputType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
};

/**
 * Compresses a Blob (e.g., screenshot canvas blob) and returns a compressed File.
 */
export const compressBlob = async (
  blob: Blob,
  fileName: string,
  maxDimension: number = MAX_DIMENSION,
  quality: number = DEFAULT_QUALITY
): Promise<File> => {
  const file = new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
  return compressImage(file, maxDimension, quality);
};
