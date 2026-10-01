import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useClassParser } from "~/hooks/useClassParser";
import { useToast } from "~/components/Toast/ToastProvider";
import ImageManager from "~/utils/ImageManager";
import FormButton from "./FormButton";

export type UploadedFile = {
  file: File;
  url: string; // Blob url, useful for previews
  base64: string;
};

type AcceptedType = { mime: string; error: string };

type FormUploaderProps = {
  label?: string;
  buttonText?: string;
  description?: string;
  maxSizeMB?: number;
  pdfType?: boolean;
  imageType?: boolean;
  videoType?: boolean;
  xlsType?: boolean;
  docxType?: boolean;
  disabled?: boolean;
  flexField?: boolean;
  resetOnSelect?: boolean;
  tooBigErrorMsg?: string; // {maxSize} is replaced with maxSizeMB
  multiple?: boolean;
  errors?: string[];
  asterisk?: boolean;
  // When true and imageType is true, images are resized to fit maxSizeMB (and max dimensions) instead of being rejected
  resizeImageToMaxSize?: boolean;
  maxImageWidth?: number;
  maxImageHeight?: number;
  className?: string;
  current?: ReactNode; // Rendered next to the button (e.g. the current file)
  // Replaces the default UI, launchPicker opens the file picker
  children?: (params: { launchPicker: () => void }) => ReactNode;
  onChange?: (value: UploadedFile | UploadedFile[]) => void;
  onReset?: () => void;
};

const TYPES: Record<string, AcceptedType[]> = {
  image: [{ mime: "image.*", error: "Image" }],
  pdf: [{ mime: "application/pdf", error: "PDF" }],
  video: [{ mime: "video.*", error: "Video" }],
  xls: [
    { mime: "sheet|ms-excel", error: "XLS" },
    { mime: "csv", error: "CSV" },
  ],
  docx: [
    {
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      error: "DOCX",
    },
  ],
};

function getBase64Url(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export default function FormUploader({
  label,
  buttonText = "Upload file",
  description,
  maxSizeMB = 2,
  pdfType = false,
  imageType = false,
  videoType = false,
  xlsType = false,
  docxType = false,
  disabled = false,
  flexField = false,
  resetOnSelect = false,
  tooBigErrorMsg = "The file must be smaller than {maxSize}MB",
  multiple = false,
  errors,
  asterisk = false,
  resizeImageToMaxSize = true,
  maxImageWidth = 1000,
  maxImageHeight = 1000,
  className,
  current,
  children,
  onChange,
  onReset,
}: FormUploaderProps) {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const tooBigMsg = tooBigErrorMsg.replace("{maxSize}", maxSizeMB.toFixed(2));

  // Without a specific type every type but DOCX is accepted
  const noTypeSelected =
    !imageType && !pdfType && !videoType && !xlsType && !docxType;
  const acceptedTypes = noTypeSelected
    ? [...TYPES.image, ...TYPES.pdf, ...TYPES.video, ...TYPES.xls]
    : [
        ...(imageType ? TYPES.image : []),
        ...(pdfType ? TYPES.pdf : []),
        ...(videoType ? TYPES.video : []),
        ...(xlsType ? TYPES.xls : []),
        ...(docxType ? TYPES.docx : []),
      ];

  const launchFilePicker = () => {
    if (disabled) return;
    fileInput.current?.click();
  };

  const resetInput = () => {
    if (fileInput.current) fileInput.current.value = "";
    setFile(null);
    onReset?.();
  };

  // Check the type matches at least 1 of the accepted mimetypes
  const checkFileType = (type: string) => {
    const valid = acceptedTypes.some((accepted) => type.match(accepted.mime));

    if (!valid) {
      const names = acceptedTypes.map((accepted) => accepted.error);
      toast.error(`The file is not ${names.join(" or ")}`);
    }

    return valid;
  };

  const checkFileSize = (fileSize: number) => {
    const sizeMB = fileSize / (1024 * 1024);

    if (sizeMB > maxSizeMB) {
      toast.error(tooBigMsg);
      return false;
    }

    return true;
  };

  const processFile = async (selected: File): Promise<UploadedFile | null> => {
    if (!checkFileType(selected.type)) return null;

    let finalFile = selected;
    if (imageType && resizeImageToMaxSize && selected.type.startsWith("image/")) {
      try {
        const imageManager = new ImageManager({
          maxSizeMB,
          maxWidth: maxImageWidth,
          maxHeight: maxImageHeight,
        });
        finalFile = await imageManager.resize(selected);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error resizing the image",
        );
        return null;
      }
    } else if (!checkFileSize(selected.size)) {
      return null;
    }

    return {
      file: finalFile,
      url: URL.createObjectURL(finalFile),
      base64: await getBase64Url(finalFile),
    };
  };

  const fileSelected = async (evt: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(evt.target.files ?? []);
    if (!files.length) return;

    if (multiple) {
      const result: UploadedFile[] = [];
      for (const selected of files) {
        const item = await processFile(selected);
        if (!item) return;
        result.push(item);
      }
      onChange?.(result);
    } else {
      const item = await processFile(files[0]);
      if (!item) return;
      setFile(item.file);
      onChange?.(item);
    }

    if (resetOnSelect) resetInput();
  };

  const containerClass = useClassParser({
    "form-container form-uploader": true,
    "flex-field": flexField,
    disabled,
    "input-error": !!errors?.length,
  });

  return (
    <div
      className={`${useClassParser({
        "form-uploader": true,
        disabled,
        "input-error": !!errors?.length,
      })} ${className ?? ""}`.trim()}
    >
      {children ? (
        children({ launchPicker: launchFilePicker })
      ) : (
        <div className={containerClass}>
          {label && (
            <label>
              {label}
              {asterisk && <span className="fw-bold text-danger">*</span>}
            </label>
          )}

          <div className="form-wrapper">
            <div className="btn-group">
              {current}

              <FormButton
                theme={errors?.length ? "danger" : "primary"}
                icon="fa fa-paperclip"
                block
                disabled={disabled}
                onClick={launchFilePicker}
              >
                {buttonText}
              </FormButton>
            </div>
          </div>
          <div className="d-flex">
            {file ? (
              <small>
                {file.name} ({(file.size / 1024).toFixed(2)}kb)
                <i className="fa fa-times ml-2 pointer" onClick={resetInput} />
              </small>
            ) : (
              description && <small className="text-muted">{description}</small>
            )}

            {!!errors?.length && (
              <small className="text-danger ml-auto">{errors.join(", ")}</small>
            )}
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInput}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={fileSelected}
      />
    </div>
  );
}
