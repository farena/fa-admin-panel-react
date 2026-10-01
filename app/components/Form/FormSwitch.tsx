import { useId } from "react";
import { useClassParser } from "~/hooks/useClassParser";

type FormSwitchProps = {
  value: boolean;
  label?: string;
  small?: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

export default function FormSwitch({
  label,
  value,
  small = false,
  disabled = false,
  onChange,
}: FormSwitchProps) {
  const id = useId();

  return (
    <div
      className={useClassParser({
        "form-container": true,
        "form-switch": true,
        small: small,
        disabled: disabled,
      })}
    >
      <input
        id={id}
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
}
