import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { useClassParser } from "~/hooks/useClassParser";

type FormCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  label?: string;
  value: boolean;
  disabled?: boolean;
  small?: boolean;
  onChange: (val: boolean) => void;
};

export default function FormText({
  label,
  value,
  disabled = false,
  small = false,
  onChange,
}: FormCheckboxProps) {
  const id = useId();

  return (
    <div
      className={useClassParser({
        "form-container": true,
        "form-checkbox": true,
        disabled,
        small,
      })}
    >
      <input
        type="checkbox"
        id={id}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
}
