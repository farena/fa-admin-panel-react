import { useRef, useState } from "react";
import FaModal from "@farena/fa-modal-react";
import ImageCropper, {
  type ImageCropperHandle,
} from "~/components/ImageCropper/ImageCropper";
import { useToast } from "~/components/Toast/ToastProvider";
import ImageManager from "~/utils/ImageManager";
import FormButton from "./FormButton";

type FormImageCropperProps = {
  img: string; // Image url (blob, base64 or a remote url with CORS)
  imgType?: string; // Mimetype of the crop, the original file's by default
  // Name of the emitted file. The backend takes the extension from the mimetype,
  // but the panel shows it next to the uploader
  imgName?: string;
  aspectRatio?: number | null;
  circle?: boolean; // Circular stencil (1:1), the crop is still square
  title?: string;
  buttonText?: string;
  // Same limits FormUploader applies when picking the file. The crop goes through
  // them again because canvas.toBlob() re-encodes: a big PNG crop can weigh more
  // than the file that was already shrunk when it was selected
  maxSizeMB?: number;
  maxImageWidth?: number;
  maxImageHeight?: number;
  onCropped: (file: File) => void;
  onClose: () => void; // Unmount the cropper here
};

export default function FormImageCropper({
  img,
  imgType,
  imgName = "crop",
  aspectRatio = null,
  circle = false,
  title = "Crop image",
  buttonText = "Crop image",
  maxSizeMB = 2,
  maxImageWidth = 1000,
  maxImageHeight = 1000,
  onCropped,
  onClose,
}: FormImageCropperProps) {
  const toast = useToast();
  const cropperRef = useRef<ImageCropperHandle>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * Returns the crop as a File, shrunk when needed. A File (not a bare Blob)
   * keeps type and name together: if ImageManager had to recompress, the result
   * is a JPEG and must be uploaded as such, not with the original file's type.
   * If shrinking fails the crop is emitted as is: losing the crop the user just
   * made is worse than uploading a heavy image.
   */
  const toFinalFile = async (blob: Blob) => {
    const file = new File([blob], imgName, { type: blob.type });

    try {
      const imageManager = new ImageManager({
        maxSizeMB,
        maxWidth: maxImageWidth,
        maxHeight: maxImageHeight,
      });
      return await imageManager.resize(file);
    } catch (err) {
      toast.error((err as Error)?.message || "Error resizing the image");
      return file;
    }
  };

  const finish = async (close: () => void) => {
    if (!ready || saving || !cropperRef.current) return;

    // Stays disabled while compressing, a second click would emit the crop twice
    setSaving(true);
    try {
      const blob = await cropperRef.current.toBlob(imgType);
      onCropped(await toFinalFile(blob));
      close();
    } catch (err) {
      toast.error((err as Error)?.message || "Error cropping the image");
      setSaving(false);
    }
  };

  return (
    <FaModal
      size="md"
      header={<h5 className="m-0">{title}</h5>}
      footer={({ close }) => (
        <FormButton
          small
          disabled={!ready || saving}
          onClick={() => finish(close)}
        >
          {buttonText}
        </FormButton>
      )}
      onClose={onClose}
    >
      <ImageCropper
        ref={cropperRef}
        src={img}
        aspectRatio={aspectRatio}
        circle={circle}
        height="min(600px, 70vh)"
        onReady={() => setReady(true)}
      />
    </FaModal>
  );
}
