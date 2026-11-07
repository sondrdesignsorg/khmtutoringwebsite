export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/bmp',
  'image/tiff',
  'image/heic',
  'image/heif',
] as const;

export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

export const IMAGE_ACCEPT = [
  ...IMAGE_MIME_TYPES,
  '.jpg',
  '.jpeg',
  '.jfif',
  '.png',
  '.webp',
  '.gif',
  '.avif',
  '.bmp',
  '.tif',
  '.tiff',
  '.heic',
  '.heif',
].join(',');

export const MAX_IMAGE_INPUT_BYTES = 25 * 1024 * 1024;
export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
export const RECOMMENDED_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 1600;
export const RECOMMENDED_IMAGE_DIMENSION = 600;
export const IMAGE_UPLOAD_TIMEOUT_MS = 2 * 60 * 1000;

export const UPLOADABLE_IMAGE_MIME_TYPES: ImageMimeType[] = IMAGE_MIME_TYPES.filter(
  (type) => type !== 'image/heic' && type !== 'image/heif',
);

const EXTENSION_MIME_TYPES: Record<string, ImageMimeType> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jfif: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  bmp: 'image/bmp',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  heic: 'image/heic',
  heif: 'image/heif',
};

const GENERIC_MIME_TYPES = new Set(['', 'application/octet-stream', 'binary/octet-stream']);

export function inferImageMimeType(fileName: string, declaredType = ''): ImageMimeType | null {
  const type = declaredType.toLowerCase().trim();

  if (type === 'image/jpg' || type === 'image/pjpeg') return 'image/jpeg';
  if (type === 'image/x-png') return 'image/png';
  if ((IMAGE_MIME_TYPES as readonly string[]).includes(type)) return type as ImageMimeType;
  if (!GENERIC_MIME_TYPES.has(type)) return null;

  const extension = fileName.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
  return extension ? EXTENSION_MIME_TYPES[extension] ?? null : null;
}

export function isHeicImage(type: string): boolean {
  return type === 'image/heic' || type === 'image/heif';
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    const megabytes = bytes / (1024 * 1024);
    return `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)} MB`;
  }
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}
