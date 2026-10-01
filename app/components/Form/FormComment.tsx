import { useEffect, useRef, useState } from "react";
import { humanReadableSize } from "~/utils/string";
import FormButton from "./FormButton";
import FormText from "./FormText";
import FormUploader, { type UploadedFile } from "./FormUploader";

// A freshly uploaded file, or one already stored in the backend
export type CommentAttachment = UploadedFile | { name: string; size: number };

export type CommentForm = {
  description: string;
  attachments: CommentAttachment[];
};

type CommentUser = {
  first_name: string;
  last_name: string;
};

type FormCommentProps = {
  value?: CommentForm | null; // Comment being edited, empty for a new one
  user?: CommentUser | null; // Author, used for the avatar initials
  placeholder?: string;
  startOpen?: boolean;
  onSave: (form: CommentForm) => void;
  onCancel?: () => void; // Only called when editing an existing comment
  onAddAttachment?: (attachment: UploadedFile) => Promise<void> | void;
  onRemoveAttachment?: (attachment: CommentAttachment) => Promise<void> | void;
};

const EMPTY_FORM: CommentForm = { description: "", attachments: [] };

const attachmentName = (a: CommentAttachment) =>
  "file" in a ? a.file.name : a.name;
const attachmentSize = (a: CommentAttachment) =>
  "file" in a ? a.file.size : a.size;

export default function FormComment({
  value,
  user,
  placeholder = "Write a comment...",
  startOpen = false,
  onSave,
  onCancel,
  onAddAttachment,
  onRemoveAttachment,
}: FormCommentProps) {
  const [active, setActive] = useState(startOpen);
  const [form, setForm] = useState<CommentForm>(() => ({
    description: value?.description ?? "",
    attachments: value?.attachments ?? [],
  }));
  const wrapperRef = useRef<HTMLDivElement>(null);

  const userAvatar = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : null;

  // Bring the whole form into view once it opens
  useEffect(() => {
    if (active) wrapperRef.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setActive(false);
  };

  const deactivateForm = () => {
    if (value) {
      onCancel?.();
    } else {
      resetForm();
    }
  };

  const saveForm = () => {
    onSave(form);
    resetForm();
  };

  const onSelectFile = async (file: UploadedFile | UploadedFile[]) => {
    const files = Array.isArray(file) ? file : [file];

    for (const f of files) {
      await onAddAttachment?.(f);
    }
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = async (index: number) => {
    await onRemoveAttachment?.(form.attachments[index]);
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, ix) => ix !== index),
    }));
  };

  return (
    <div className="form-comment">
      <div className="form-wrapper" ref={wrapperRef}>
        <div className="user-avatar">
          {userAvatar ?? <i className="fa-solid fa-user" />}
        </div>

        {!active ? (
          <FormText
            placeholder={placeholder}
            value=""
            onChange={() => {}}
            onFocus={() => setActive(true)}
          />
        ) : (
          <div>
            <FormText
              textarea
              textareaRows={3}
              placeholder={placeholder}
              value={form.description}
              autoFocus
              onChange={(description) => setForm({ ...form, description })}
            />

            <div className="form-comment-actions">
              <FormUploader resetOnSelect onChange={onSelectFile}>
                {({ launchPicker }) => (
                  <FormButton
                    small
                    plain
                    tooltip="Attach file"
                    tooltipContainer={wrapperRef.current ?? undefined}
                    icon="fa-solid fa-paperclip"
                    onClick={launchPicker}
                  />
                )}
              </FormUploader>

              <div>
                <FormButton
                  small
                  theme="medium"
                  className="mr-1"
                  onClick={deactivateForm}
                >
                  Cancel
                </FormButton>
                <FormButton small onClick={saveForm}>
                  Confirm
                </FormButton>
              </div>
            </div>

            {!!form.attachments.length && (
              <ul className="form-comment-attachments">
                {form.attachments.map((a, ai) => (
                  <li key={ai}>
                    <div className="badge badge-medium">
                      <span>
                        {attachmentName(a)} (
                        {humanReadableSize(attachmentSize(a))})
                      </span>
                      <i
                        className="fa-solid fa-xmark pointer"
                        onClick={() => removeAttachment(ai)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
