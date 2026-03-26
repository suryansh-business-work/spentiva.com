import sharp from 'sharp';

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 80;
const PNG_COMPRESSION = 6;

/**
 * Checks if a file is an image based on its mimetype
 */
export const isImageFile = (mimetype: string): boolean => {
  return mimetype.startsWith('image/') && mimetype !== 'image/svg+xml';
};

/**
 * Compresses and resizes an image buffer if it exceeds MAX_DIMENSION.
 * Returns the original buffer for non-image or SVG files.
 */
export const processImageBuffer = async (
  buffer: Buffer,
  mimetype: string,
  maxDimension: number = MAX_DIMENSION
): Promise<{ buffer: Buffer; mimetype: string }> => {
  if (!isImageFile(mimetype)) {
    return { buffer, mimetype };
  }

  const metadata = await sharp(buffer).metadata();
  const { width, height } = metadata;

  if (!width || !height) {
    return { buffer, mimetype };
  }

  // Already within limits
  if (width <= maxDimension && height <= maxDimension) {
    return { buffer, mimetype };
  }

  let pipeline = sharp(buffer).resize({
    width: maxDimension,
    height: maxDimension,
    fit: 'inside',
    withoutEnlargement: true,
  });

  let outputMimetype = mimetype;

  if (mimetype === 'image/png') {
    pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION });
    outputMimetype = 'image/png';
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY });
    outputMimetype = 'image/jpeg';
  }

  const processedBuffer = await pipeline.toBuffer();
  return { buffer: processedBuffer, mimetype: outputMimetype };
};
