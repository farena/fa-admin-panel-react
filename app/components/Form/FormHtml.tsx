import { useImperativeHandle, useRef, type Ref } from "react";
import { FaWysiwyg, type FaWysiwygHandle } from "@farena/fa-wysiwyg-react";
import { useClassParser } from "~/hooks/useClassParser";

// Imperative API exposed to the parent through `ref`
export type FormHtmlHandle = {
  focus: () => void;
  getData: () => string; // Latest HTML, without waiting for the onChange debounce
};

type FormHtmlProps = {
  label?: string;
  value: string | null;
  disabled?: boolean;
  placeholder?: string;
  autocompleteOpts?: string[]; // Mention options, only entries starting with "#" are used
  lang?: string;
  errors?: string[];
  ref?: Ref<FormHtmlHandle>;
  onChange: (value: string) => void;
};

export default function FormHtml({
  label,
  value,
  disabled = false,
  placeholder,
  autocompleteOpts,
  lang = "en",
  errors,
  ref,
  onChange,
}: FormHtmlProps) {
  const editorRef = useRef<FaWysiwygHandle>(null);

  useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.focus(),
    getData: () => editorRef.current?.getData() ?? value ?? "",
  }));

  return (
    <div
      className={useClassParser({
        "form-container": true,
        "form-html": true,
        "input-error": !!errors?.length,
        disabled,
      })}
    >
      {label && (
        <label>
          {label}{" "}
          <small className="text-muted">
            Use Shift+Enter or Ctrl+Enter for soft line breaks
          </small>
        </label>
      )}
      <div className="form-wrapper">
        <FaWysiwyg
          ref={editorRef}
          value={value ?? ""}
          placeholder={placeholder}
          autocompleteOpts={autocompleteOpts}
          lang={lang}
          disabled={disabled}
          onChange={onChange}
        />
      </div>

      {!!errors?.length && <p className="error-message">{errors.join(", ")}</p>}
    </div>
  );
}
