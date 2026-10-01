import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { useClassParser } from "~/hooks/useClassParser";

type FormBlockProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  label?: string;
  icon?: string;
  disabled?: boolean;
  flexField?: boolean;
  errors?: string[];
  children: ReactNode;
};

export default function FormText({
  label,
  icon,
  disabled = false,
  flexField = false,
  errors,
  children,
}: FormBlockProps) {
  const id = useId();

  return (
    <div
      className={useClassParser({
        "form-container": true,
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
        <div className="flex-1" style={{ minHeight: "32px" }}>
          {children}
        </div>
      </div>

      {!!errors?.length && <p className="error-message">{errors.join(", ")}</p>}
    </div>
  );
}
