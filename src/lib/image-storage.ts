// =============================================================================
// IMAGE STORAGE SERVICE
// =============================================================================
// MVP: stores images as base64 in localStorage.
// Future: upload to Supabase Storage and store URLs.
//
// Limitations:
// - localStorage has ~5MB limit per origin
// - Images are compressed/resized before storage
// - For MVP this is sufficient (5-15 images per site)
// =============================================================================

const STORAGE_KEY_PREFIX = "siteforge_images_";

export interface StoredImage {
  id: string;
  dataUrl: string; // base64 data URL
  name: string;
  width: number;
  height: number;
}

/** Store an image for a specific site */
export function saveImage(siteId: string, image: StoredImage): void {
  const images = getImages(siteId);
  images.push(image);
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + siteId, JSON.stringify(images));
  } catch {
    console.warn("[ImageStorage] localStorage full — consider cleaning up old images");
  }
}

/** Get all images for a site */
export function getImages(siteId: string): StoredImage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + siteId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Delete an image */
export function deleteImage(siteId: string, imageId: string): void {
  const images = getImages(siteId).filter((img) => img.id !== imageId);
  localStorage.setItem(STORAGE_KEY_PREFIX + siteId, JSON.stringify(images));
}

/** Generate a unique image ID */
export function generateImageId(): string {
  return `img_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Read a File as a resized base64 data URL.
 * Resizes to maxWidth to keep localStorage usage reasonable.
 */
export function fileToDataUrl(
  file: File,
  maxWidth: number = 800
): Promise<StoredImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.onload = () => {
        // Resize if needed
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

        resolve({
          id: generateImageId(),
          dataUrl,
          name: file.name,
          width,
          height,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
