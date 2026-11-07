import { describe, expect, it } from 'vitest';
import {
  IMAGE_ACCEPT,
  MAX_IMAGE_INPUT_BYTES,
  MAX_IMAGE_UPLOAD_BYTES,
  RECOMMENDED_IMAGE_MAX_BYTES,
  UPLOADABLE_IMAGE_MIME_TYPES,
  formatFileSize,
  inferImageMimeType,
  isHeicImage,
} from '@/lib/image-upload';

describe('image upload rules', () => {
  it('accepts common image mime types', () => {
    expect(inferImageMimeType('photo.jpg', 'image/jpeg')).toBe('image/jpeg');
    expect(inferImageMimeType('photo.png', 'image/png')).toBe('image/png');
    expect(inferImageMimeType('photo.webp', 'image/webp')).toBe('image/webp');
    expect(inferImageMimeType('photo.avif', 'image/avif')).toBe('image/avif');
  });

  it('normalizes legacy mime types', () => {
    expect(inferImageMimeType('photo.jpg', 'image/jpg')).toBe('image/jpeg');
    expect(inferImageMimeType('photo.jpeg', 'image/pjpeg')).toBe('image/jpeg');
    expect(inferImageMimeType('photo.png', 'image/x-png')).toBe('image/png');
  });

  it('infers from the extension when the browser gives no usable mime type', () => {
    expect(inferImageMimeType('IMG_1234.HEIC', '')).toBe('image/heic');
    expect(inferImageMimeType('portrait.jpeg', 'application/octet-stream')).toBe('image/jpeg');
    expect(inferImageMimeType('scan.TIFF', 'binary/octet-stream')).toBe('image/tiff');
  });

  it('rejects unsupported types even when the filename looks like an image', () => {
    expect(inferImageMimeType('vector.svg', 'image/svg+xml')).toBeNull();
    expect(inferImageMimeType('script.png', 'text/html')).toBeNull();
    expect(inferImageMimeType('unknown.bin', 'application/octet-stream')).toBeNull();
  });

  it('converts HEIC/HEIF before upload instead of allowing it through', () => {
    expect(isHeicImage('image/heic')).toBe(true);
    expect(isHeicImage('image/heif')).toBe(true);
    expect(isHeicImage('image/jpeg')).toBe(false);
    expect(UPLOADABLE_IMAGE_MIME_TYPES).not.toContain('image/heic');
    expect(UPLOADABLE_IMAGE_MIME_TYPES).not.toContain('image/heif');
  });

  it('builds an accept list that still allows camera formats', () => {
    expect(IMAGE_ACCEPT).toContain('image/jpeg');
    expect(IMAGE_ACCEPT).toContain('image/heic');
    expect(IMAGE_ACCEPT).toContain('.heic');
    expect(IMAGE_ACCEPT).toContain('.tiff');
  });

  it('formats limits for display', () => {
    expect(formatFileSize(MAX_IMAGE_INPUT_BYTES)).toBe('25 MB');
    expect(formatFileSize(MAX_IMAGE_UPLOAD_BYTES)).toBe('10 MB');
    expect(formatFileSize(RECOMMENDED_IMAGE_MAX_BYTES)).toBe('5 MB');
    expect(formatFileSize(1536)).toBe('2 KB');
    expect(formatFileSize(900)).toBe('900 B');
  });
});
