const MAX_DIMENSION = 1200;
const ENCODE_QUALITY = 0.82;
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

/**
 * Downscales and re-encodes an image in the browser before upload.
 * Tutor headshots are displayed at most ~600px wide, so shipping the
 * original camera photo (often 5-15MB) over the network is unnecessary.
 */
export async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));

    if (scale === 1 && file.size <= SKIP_UNDER_BYTES) {
      bitmap.close();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
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
    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^./\\]+$/, '') || 'image';
    const ext = type === 'image/webp' ? 'webp' : 'jpg';
    return new File([blob], `${base}.${ext}`, { type });
  } catch {
    return file;
  }
}
