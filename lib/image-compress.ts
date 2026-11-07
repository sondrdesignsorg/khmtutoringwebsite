import {
  MAX_IMAGE_DIMENSION,
  inferImageMimeType,
  isHeicImage,
} from './image-upload';

const ENCODE_QUALITY = 0.85;
const SKIP_UNDER_BYTES = 300 * 1024;

let webpSupported: boolean | null = null;

function supportsWebp(): boolean {
  if (webpSupported !== null) return webpSupported;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  webpSupported = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  return webpSupported;
}

async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    const { default: heic2any } = await import('heic2any');
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    if (!blob) throw new Error('No image data');
    const base = file.name.replace(/\.[^./\\]+$/, '') || 'image';
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg' });
  } catch {
    throw new Error('Could not read this HEIC/HEIF photo. Export it as a JPG or PNG and try again.');
  }
}

/**
 * Downscales and re-encodes an image in the browser before upload.
 * Tutor headshots are displayed at most ~600px wide, so shipping the
 * original camera photo (often 5-15MB) over the network is unnecessary.
 */
export async function compressImageForUpload(file: File): Promise<File> {
  const mime = inferImageMimeType(file.name, file.type);
  if (!mime) throw new Error('Choose a JPG, PNG, WebP, GIF, AVIF, HEIC, BMP, or TIFF image.');
  if (mime === 'image/gif') return file;

  let source = file;
  if (isHeicImage(mime)) {
    source = await convertHeicToJpeg(file);
  }

  if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') return source;

  try {
    const bitmap = await createImageBitmap(source);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));

    if (scale === 1 && source.size <= SKIP_UNDER_BYTES) {
      bitmap.close();
      return source;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return source;
    }

    const type = supportsWebp() ? 'image/webp' : 'image/jpeg';
    if (type === 'image/jpeg') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, ENCODE_QUALITY),
    );
    if (!blob || blob.size >= source.size) return source;

    const base = source.name.replace(/\.[^./\\]+$/, '') || 'image';
    const ext = type === 'image/webp' ? 'webp' : 'jpg';
    return new File([blob], `${base}.${ext}`, { type });
  } catch {
    return source;
  }
}
