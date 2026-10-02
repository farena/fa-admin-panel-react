import { useImperativeHandle, useRef, type Ref } from "react";
import { Editor, type OnMount } from "@monaco-editor/react";
import { useClassParser } from "~/hooks/useClassParser";

type CodeEditor = Parameters<OnMount>[0];

// Imperative API exposed to the parent through `ref`
export type FormCodeHandle = {
  formatCode: () => void;
};

type FormCodeProps = {
  label?: string;
  value: string | null;
  language?: string;
  disabled?: boolean;
  errors?: string[];
  ref?: Ref<FormCodeHandle>;
  onChange: (value: string) => void;
};

const EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  autoIndent: "full",
  fontSize: 12,
  minimap: { enabled: false },
} as const;

export default function FormCode({
  label,
  value,
  language = "html",
  disabled = false,
  errors,
  ref,
  onChange,
}: FormCodeProps) {
  const editorRef = useRef<CodeEditor | null>(null);

  useImperativeHandle(ref, () => ({
    formatCode: () => {
      editorRef.current?.getAction("editor.action.formatDocument")?.run();
    },
  }));

  return (
    <div
      className={useClassParser({
        "form-container": true,
        "form-code": true,
        "input-error": !!errors?.length,
        disabled,
      })}
    >
      {label && <label>{label}</label>}
      <div className="form-wrapper">
        <Editor
          value={value ?? ""}
          language={language}
          theme="vs"
          options={{ ...EDITOR_OPTIONS, readOnly: disabled }}
          onMount={(editor) => (editorRef.current = editor)}
          onChange={(val) => onChange(val ?? "")}
        />
      </div>

      {!!errors?.length && <p className="error-message">{errors.join(", ")}</p>}
    </div>
  );
}
