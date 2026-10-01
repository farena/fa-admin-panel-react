const DEFAULT_JPEG_QUALITY = 0.92;
const MIN_QUALITY = 0.1;
const QUALITY_STEP = 0.15;
const SIZE_SCALE_DOWN_FACTOR = 0.85;
const MIN_DIMENSION = 16;

type ImageManagerOptions = {
  maxSizeMB: number;
  maxWidth?: number | null;
  maxHeight?: number | null;
};

/**
 * Reusable image resize utility. Enforces max file size (MB) and optional max width/height.
 * Returns a File so callers (e.g. FormUploader) can build blob / base64 urls as needed.
 */
export default class ImageManager {
  private maxSizeBytes: number;
  private maxWidth: number | null;
  private maxHeight: number | null;

  constructor({ maxSizeMB, maxWidth, maxHeight }: ImageManagerOptions) {
    if (typeof maxSizeMB !== "number" || maxSizeMB <= 0) {
      throw new Error("ImageManager: maxSizeMB must be a positive number");
    }
    this.maxSizeBytes = maxSizeMB * 1024 * 1024;
    this.maxWidth = maxWidth != null ? Math.max(1, Math.floor(maxWidth)) : null;
    this.maxHeight =
      maxHeight != null ? Math.max(1, Math.floor(maxHeight)) : null;
  }

  /**
   * Resize image to satisfy maxSizeMB and optional max width/height.
   * @returns Resized file (or the original if already within limits)
   * @throws If file is not an image or the image fails to load
   */
  async resize(file: File): Promise<File> {
    if (!(file instanceof File)) {
      throw new Error("ImageManager: expected a File");
    }
    if (!file.type?.startsWith("image/")) {
      throw new Error("ImageManager: file is not an image");
    }

    const url = URL.createObjectURL(file);
    try {
      const img = await this.loadImage(url);
      const { width: w, height: h } = img;
      const { drawWidth, drawHeight } = this.computeDrawSize(w, h);

      const alreadyWithinSize = file.size <= this.maxSizeBytes;
      const alreadyWithinDimensions =
        (this.maxWidth == null || drawWidth >= w) &&
        (this.maxHeight == null || drawHeight >= h);
      if (alreadyWithinSize && alreadyWithinDimensions) {
        return file;
      }

      const blob = await this.canvasToBlobUnderMaxSize(
        img,
        drawWidth,
        drawHeight,
      );
      const name = this.outputFileName(file.name);
      return new File([blob], name, { type: "image/jpeg" });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error("ImageManager: failed to load image"));
      img.src = url;
    });
  }

  private computeDrawSize(srcWidth: number, srcHeight: number) {
    let drawWidth = srcWidth;
    let drawHeight = srcHeight;
    if (this.maxWidth != null && srcWidth > this.maxWidth) {
      const r = this.maxWidth / srcWidth;
      drawWidth = this.maxWidth;
      drawHeight = Math.max(1, Math.round(srcHeight * r));
    }
    if (this.maxHeight != null && drawHeight > this.maxHeight) {
      const r = this.maxHeight / drawHeight;
      drawHeight = this.maxHeight;
      drawWidth = Math.max(1, Math.round(drawWidth * r));
    }
    return { drawWidth, drawHeight };
  }

  private canvasToBlobUnderMaxSize(
    img: HTMLImageElement,
    drawWidth: number,
    drawHeight: number,
  ): Promise<Blob> {
    const maxBytes = this.maxSizeBytes;
    let width = drawWidth;
    let height = drawHeight;
    let quality = DEFAULT_JPEG_QUALITY;

    return new Promise((resolve, reject) => {
      const tryBlob = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("ImageManager: canvas context not available"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("ImageManager: toBlob failed"));
              return;
            }
            if (blob.size <= maxBytes) {
              resolve(blob);
              return;
            }
            if (quality > MIN_QUALITY) {
              quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
              tryBlob();
              return;
            }
            if (width > MIN_DIMENSION && height > MIN_DIMENSION) {
              width = Math.max(
                MIN_DIMENSION,
                Math.floor(width * SIZE_SCALE_DOWN_FACTOR),
              );
              height = Math.max(
                MIN_DIMENSION,
                Math.floor(height * SIZE_SCALE_DOWN_FACTOR),
              );
              quality = DEFAULT_JPEG_QUALITY;
              tryBlob();
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          quality,
        );
      };
      tryBlob();
    });
  }

  private outputFileName(originalName: string) {
    const base = originalName.replace(/\.[^.]+$/, "");
    return `${base || "image"}.jpg`;
  }
}
