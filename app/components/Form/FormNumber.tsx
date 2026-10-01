import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useClassParser } from "~/hooks/useClassParser";
import {
  centsToDollars,
  dollarsToCents,
  formatCentsToMoney,
} from "~/utils/string";

type FormNumberProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  value: number;
  label?: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  flexField?: boolean;
  selectOnFocus?: boolean;
  // value is in cents; it's shown formatted as money and edited in dollars
  moneyFormat?: boolean;
  max?: number;
  min?: number;
  step?: number;
  showArrows?: boolean;
  errors?: string[];
  children?: ReactNode;
  onChange: (value: string) => void;
};

export default function FormNumber({
  value,
  label,
  description,
  icon,
  disabled = false,
  flexField = false,
  selectOnFocus = false,
  moneyFormat = false,
  max,
  min,
  step,
  showArrows = false,
  errors = [],
  children,
  onChange,
  ...props
}: FormNumberProps) {
  const id = useId();
  const focused = useRef(false);
  const [inputType, setInputType] = useState(moneyFormat ? "text" : "number");
  const [result, setResult] = useState<number | string>(
    moneyFormat ? formatCentsToMoney(value) : value
  );

  // Sync external value changes, but don't overwrite what the user is typing
  useEffect(() => {
    if (value === null || value === undefined || focused.current) return;
    setInputType(moneyFormat ? "text" : "number");
    setResult(moneyFormat ? formatCentsToMoney(value) : value);
  }, [value, moneyFormat]);

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    focused.current = true;

    if (moneyFormat) {
      setInputType("number");
      setResult(centsToDollars(value));
    }

    if (selectOnFocus) {
      const input = e.target;
      // Wait for the re-render (type/value swap) before selecting
      requestAnimationFrame(() => input.select());
    }
  };

  const onBlur = () => {
    focused.current = false;

    if (moneyFormat) {
      setInputType("text");
      setResult(formatCentsToMoney(value));
    }
  };

  const handleChange = (newValue: string) => {
    setResult(newValue);
    onChange(moneyFormat ? String(dollarsToCents(newValue)) : newValue);
  };

  return (
    <div
      className={useClassParser({
        "form-container": true,
        disabled,
        "flex-field": flexField,
        "show-arrows": showArrows,
        "input-error": !!errors?.length,
      })}
    >
      {label && (
        <label htmlFor={id}>
          {label} {description && <small>{description}</small>}
        </label>
      )}
      <div className="form-wrapper">
        {icon && (
          <div className="icon">
            <i className={icon}></i>
          </div>
        )}
        <input
          {...props}
          type={inputType}
          placeholder=" "
          value={result}
          id={id}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => handleChange(e.target.value)}
          step={step}
          min={min}
          max={max}
        />
        {children}
      </div>
      {!!errors?.length && (
        <p className="error-message">{errors.join(", ")}</p>
      )}
    </div>
  );
}
