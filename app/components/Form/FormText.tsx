import { useId, type InputHTMLAttributes } from "react";
import { useClassParser } from "~/hooks/useClassParser";

type FormTextProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label?: string;
  placeholder?: string;
  description?: string;
  icon?: string;
  password?: boolean;
  value: string;
  disabled?: boolean;
  textarea?: boolean;
  textareaRows?: number;
  flexField?: boolean;
  maxChars?: number;
  isPhone?: boolean;
  errors?: string[];
  onChange: (value: string) => void;
};

export default function FormText({
  label,
  placeholder,
  description,
  icon,
  password = false,
  value,
  disabled = false,
  textarea = false,
  textareaRows = 5,
  flexField = false,
  maxChars,
  isPhone = false,
  errors,
  onChange,
  ...props
}: FormTextProps) {
  const id = useId();

  return (
    <div
      className={useClassParser({
        "form-container": true,
        "form-textarea": textarea,
        "flex-field": flexField,
        "input-error": !!errors?.length,
        disabled,
      })}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <div className="form-wrapper">
        {icon && (
          <span className="icon">
            <i className={icon} />
          </span>
        )}
        {textarea ? (
          <textarea
            placeholder={placeholder || " "}
            rows={textareaRows}
            id={id}
            value={value}
            readOnly={disabled}
            onChange={(e) => onChange(e.target.value)}
            {...(props as InputHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id}
            type={password ? "password" : "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            {...props}
          />
        )}
      </div>

      {maxChars && (
        <p
          style={{
            margin: "0.25em 0 0 0",
            textAlign: "right",
            fontSize: "0.7em",
          }}
          className={useClassParser({
            "text-danger": (value?.length ?? 0) > maxChars,
          })}
        >
          {maxChars - (value?.length ?? 0)}/{maxChars} characters
        </p>
      )}
      {!!errors?.length && (
        <p className="error-message">{errors.join(", ")}</p>
      )}
    </div>
  );
}
