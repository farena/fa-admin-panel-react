import { type InputHTMLAttributes, type ReactNode } from "react";
import { useClassParser } from "~/hooks/useClassParser";
import FormIcon from "./FormIcon";

type FormBlockProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  label?: string;
  icon?: string;
  iconMaterial?: boolean;
  disabled?: boolean;
  flexField?: boolean;
  errors?: string[];
  children: ReactNode;
};

export default function FormBlock({
  id,
  label,
  icon,
  iconMaterial = false,
  disabled = false,
  flexField = false,
  errors,
  children,
}: FormBlockProps) {
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
        <FormIcon icon={icon} iconMaterial={iconMaterial} />
        <div className="flex-1" style={{ minHeight: "32px" }}>
          {children}
        </div>
      </div>

      {!!errors?.length && <p className="error-message">{errors.join(", ")}</p>}
    </div>
  );
}
