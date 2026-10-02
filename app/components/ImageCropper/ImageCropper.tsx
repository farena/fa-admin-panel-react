import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type Ref,
} from "react";
import "./_image_cropper.scss";

// Crop area, in natural image pixels
export type CropRect = { x: number; y: number; width: number; height: number };

export type ImageCropperHandle = {
  // Renders the current crop at the image's natural resolution
  toBlob: (type?: string, quality?: number) => Promise<Blob>;
};

type ImageCropperProps = {
  src: string;
  aspectRatio?: number | null; // width / height, free when empty
  // Circular stencil (forces a 1:1 ratio). Visual only: the result is still the
  // square around the circle, it previews how the image fits a round container
  circle?: boolean;
  height?: number | string; // Height of the cropping area
  ref?: Ref<ImageCropperHandle>;
  onReady?: () => void; // The image loaded and can be cropped
  onChange?: (crop: CropRect) => void;
};

type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

// Smallest stencil side, in screen pixels
const MIN_SIZE_PX = 30;
// Initial stencil size relative to the image
const INITIAL_COVERAGE = 0.8;

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

function initialCrop(
  imgW: number,
  imgH: number,
  ratio: number | null,
): CropRect {
  let width = imgW * INITIAL_COVERAGE;
  let height = imgH * INITIAL_COVERAGE;

  if (ratio) {
    // Biggest box with the ratio that fits in the coverage area
    if (width / height > ratio) width = height * ratio;
    else height = width / ratio;
  }

  return { x: (imgW - width) / 2, y: (imgH - height) / 2, width, height };
}

/**
 * Resizes `start` by dragging `handle` by (dx, dy) image pixels. The opposite
 * side stays fixed (or the center, for the axis the handle doesn't touch),
 * the result stays inside the image and keeps `ratio` when set.
 */
function resizeCrop(
  start: CropRect,
  handle: Handle,
  dx: number,
  dy: number,
  bounds: { width: number; height: number },
  ratio: number | null,
  minSize: number,
): CropRect {
  const hasE = handle.includes("e");
  const hasW = handle.includes("w");
  const hasS = handle.includes("s");
  const hasN = handle.includes("n");

  const dw = hasE ? dx : hasW ? -dx : 0;
  const dh = hasS ? dy : hasN ? -dy : 0;
  const cx = start.x + start.width / 2;
  const cy = start.y + start.height / 2;

  // Room available from the fixed side/center to the image edges
  const maxW = hasE
    ? bounds.width - start.x
    : hasW
      ? start.x + start.width
      : 2 * Math.min(cx, bounds.width - cx);
  const maxH = hasS
    ? bounds.height - start.y
    : hasN
      ? start.y + start.height
      : 2 * Math.min(cy, bounds.height - cy);

  let width = start.width + dw;
  let height = start.height + dh;

  if (ratio) {
    const horizontal = hasE || hasW;
    const vertical = hasN || hasS;
    // On corners, follow the axis the pointer moved the most
    if (horizontal && vertical) {
      width = Math.abs(dw) >= Math.abs(dh * ratio) ? width : height * ratio;
    } else if (vertical) {
      width = height * ratio;
    }

    const minW = Math.max(minSize, minSize * ratio);
    width = clamp(width, Math.min(minW, maxW), Math.min(maxW, maxH * ratio));
    height = width / ratio;
  } else {
    width = clamp(width, Math.min(minSize, maxW), maxW);
    height = clamp(height, Math.min(minSize, maxH), maxH);
  }

  return {
    x: hasE ? start.x : hasW ? start.x + start.width - width : cx - width / 2,
    y: hasS
      ? start.y
      : hasN
        ? start.y + start.height - height
        : cy - height / 2,
    width,
    height,
  };
}

type Drag = {
  mode: "move" | Handle;
  pointerX: number;
  pointerY: number;
  start: CropRect;
};

export default function ImageCropper({
  src,
  aspectRatio: aspectRatioProp = null,
  circle = false,
  height = 600,
  ref,
  onReady,
  onChange,
}: ImageCropperProps) {
  const aspectRatio = circle ? 1 : aspectRatioProp;
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<Drag | null>(null);

  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 }); // Container size
  const [crop, setCrop] = useState<CropRect | null>(null);

  // Image fitted ("contain") and centered in the container
  const scale = natural ? Math.min(box.w / natural.w, box.h / natural.h) : 0;
  const imgLeft = natural ? (box.w - natural.w * scale) / 2 : 0;
  const imgTop = natural ? (box.h - natural.h * scale) / 2 : 0;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // A new image or ratio starts over
  useEffect(() => {
    setNatural(null);
    setCrop(null);
  }, [src]);

  useEffect(() => {
    if (natural) setCrop(initialCrop(natural.w, natural.h, aspectRatio));
  }, [natural, aspectRatio]);

  useEffect(() => {
    if (crop) onChange?.(crop);
  }, [crop]);

  useImperativeHandle(ref, () => ({
    toBlob: (type = "image/png", quality) =>
      new Promise((resolve, reject) => {
        const img = imgRef.current;
        if (!img || !crop) {
          reject(new Error("The image is not loaded yet"));
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(crop.width));
        canvas.height = Math.max(1, Math.round(crop.height));
        canvas
          .getContext("2d")
          ?.drawImage(
            img,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            canvas.width,
            canvas.height,
          );

        canvas.toBlob(
          (blob) =>
            blob
              ? resolve(blob)
              : reject(new Error("Could not crop the image")),
          type,
          quality,
        );
      }),
  }));

  const onImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    onReady?.();
  };

  const startDrag = (e: ReactPointerEvent, mode: Drag["mode"]) => {
    if (!crop || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    // Keeps receiving the moves even when the pointer leaves the stencil
    containerRef.current?.setPointerCapture(e.pointerId);
    drag.current = {
      mode,
      pointerX: e.clientX,
      pointerY: e.clientY,
      start: crop,
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const current = drag.current;
    if (!current || !natural || !scale) return;

    const dx = (e.clientX - current.pointerX) / scale;
    const dy = (e.clientY - current.pointerY) / scale;
    const { start } = current;

    if (current.mode === "move") {
      setCrop({
        ...start,
        x: clamp(start.x + dx, 0, natural.w - start.width),
        y: clamp(start.y + dy, 0, natural.h - start.height),
      });
      return;
    }

    setCrop(
      resizeCrop(
        start,
        current.mode,
        dx,
        dy,
        { width: natural.w, height: natural.h },
        aspectRatio,
        MIN_SIZE_PX / scale,
      ),
    );
  };

  const endDrag = (e: ReactPointerEvent) => {
    if (!drag.current) return;
    drag.current = null;
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className="image-cropper"
      style={{ height }}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <img
        ref={imgRef}
        src={src}
        alt=""
        // Lets remote images with CORS headers be read back from the canvas
        crossOrigin="anonymous"
        draggable={false}
        onLoad={onImageLoad}
        style={
          natural
            ? {
                left: imgLeft,
                top: imgTop,
                width: natural.w * scale,
                height: natural.h * scale,
              }
            : { visibility: "hidden" }
        }
      />

      {crop && scale > 0 && (
        <div
          className={`image-cropper-stencil${circle ? " image-cropper-stencil--circle" : ""}`}
          style={{
            left: imgLeft + crop.x * scale,
            top: imgTop + crop.y * scale,
            width: crop.width * scale,
            height: crop.height * scale,
          }}
          onPointerDown={(e) => startDrag(e, "move")}
        >
          {HANDLES.map((handle) => (
            <span
              key={handle}
              className={`image-cropper-handle image-cropper-handle--${handle}`}
              onPointerDown={(e) => startDrag(e, handle)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
