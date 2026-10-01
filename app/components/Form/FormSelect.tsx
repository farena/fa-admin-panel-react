import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useClassParser } from "~/hooks/useClassParser";
import FormDropdown from "./FormDropdown";

export type SelectOption = Record<string, unknown> | string | number;

type FormSelectProps = {
  value: unknown;
  label?: string;
  options: SelectOption[];
  icon?: string;
  iconMaterial?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  flexField?: boolean;
  optionLabel?: string;
  optionValue?: string;
  noDataMsg?: string;
  errors?: string[];
  asterisk?: boolean;
  children?: ReactNode;
  onChange: (value: unknown) => void;
  onSelect?: (option: SelectOption | null) => void;
  onRemove?: (option: SelectOption) => void;
};

export default function FormSelect({
  value,
  label,
  options,
  icon,
  iconMaterial = false,
  disabled = false,
  multiple = false,
  flexField = false,
  optionLabel = "label",
  optionValue = "value",
  noDataMsg = "No entries were found",
  errors,
  asterisk = false,
  children,
  onChange,
  onSelect,
  onRemove,
}: FormSelectProps) {
  const id = useId();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownOpen = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<Array<HTMLElement | null>>([]);

  // Primitive options are their own value and label
  const getValue = (opt: SelectOption) =>
    typeof opt === "object" && opt[optionValue] !== undefined
      ? opt[optionValue]
      : opt;
  const getLabel = (opt: SelectOption) =>
    typeof opt === "object"
      ? String(opt[optionLabel] ?? opt.name ?? "")
      : String(opt);
  const getKey = (opt: SelectOption, index: number) => {
    const key = getValue(opt);
    return typeof key === "string" || typeof key === "number" ? key : index;
  };

  const selected = Array.isArray(value) ? (value as SelectOption[]) : [];

  // Native selects only handle strings, so options are referenced by index
  const selectedIndex = options.findIndex((opt) => getValue(opt) === value);

  const onSelectChange = (index: string) => {
    if (index === "") {
      onChange(null);
      onSelect?.(null);
      return;
    }

    const option = options[Number(index)];
    onChange(getValue(option));
    onSelect?.(option);
  };

  const openDropdown = (open: () => void) => {
    open();
    dropdownOpen.current = true;
  };

  const closeDropdown = (close: () => void) => {
    setTimeout(() => {
      close();
      dropdownOpen.current = false;
      setHighlightedIndex(-1);
    }, 100); // Small delay to allow click event to register
  };

  const selectOption = (option: SelectOption, close: () => void) => {
    const selectedValues = selected.map(getValue);

    if (!selectedValues.includes(getValue(option))) {
      onChange([...selected, option]);
    }

    onSelect?.(option);
    closeDropdown(close);
  };

  const removeOption = (index: number) => {
    const option = selected[index];
    onChange(selected.filter((_, ix) => ix !== index));
    onRemove?.(option);
  };

  // Runs after render (equivalent to Vue's $nextTick)
  useEffect(() => {
    const highlightedOption = optionRefs.current[highlightedIndex];
    const dropdown = dropdownRef.current;
    if (!highlightedOption || !dropdown) return;

    const optionTop = highlightedOption.offsetTop;
    const optionBottom = optionTop + highlightedOption.offsetHeight;
    const dropdownScrollTop = dropdown.scrollTop;
    const dropdownHeight = dropdown.offsetHeight;

    if (optionTop < dropdownScrollTop) {
      dropdown.scrollTop = optionTop;
    } else if (optionBottom > dropdownScrollTop + dropdownHeight) {
      dropdown.scrollTop = optionBottom - dropdownHeight;
    }
  }, [highlightedIndex]);

  const onKeydown = (
    e: KeyboardEvent<HTMLDivElement>,
    open: () => void,
    close: () => void,
  ) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!dropdownOpen.current) return;

        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!dropdownOpen.current) return;

        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (!dropdownOpen.current) {
          openDropdown(open);
          return;
        }

        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          selectOption(options[highlightedIndex], close);
        } else {
          closeDropdown(close);
        }
        break;
    }
  };

  const iconElement = icon && (
    <span className="icon">
      {iconMaterial ? (
        <i className="material-symbols-outlined">{icon}</i>
      ) : (
        <i className={icon} />
      )}
    </span>
  );

  return (
    <div
      className={useClassParser({
        "form-container form-select": true,
        disabled,
        "flex-field": flexField,
        "form-select-multiple": multiple,
        "input-error": !!errors?.length,
      })}
    >
      {label && (
        <label htmlFor={id} onClick={() => resultRef.current?.focus()}>
          {label}
          {asterisk && <span className="fw-bold text-danger">*</span>}
        </label>
      )}

      {!multiple ? (
        <div className="form-wrapper">
          {iconElement}
          <select
            id={id}
            value={selectedIndex === -1 ? "" : String(selectedIndex)}
            disabled={disabled}
            onChange={(e) => onSelectChange(e.target.value)}
          >
            {/* Keeps the select blank while there's no value */}
            <option value="" hidden />
            {options.map((opt, index) => (
              <option key={getKey(opt, index)} value={index}>
                {getLabel(opt)}
              </option>
            ))}
          </select>

          {children}
        </div>
      ) : (
        <FormDropdown
          parentEl={`#form_wrapper_${id}`}
          slots={{
            action: ({ open, close }) => (
              <div className="form-wrapper" id={`form_wrapper_${id}`}>
                {iconElement}

                <div
                  id={id}
                  ref={resultRef}
                  className="select-result"
                  tabIndex={disabled ? -1 : 0}
                  onFocus={() => !disabled && openDropdown(open)}
                  onClick={() => !disabled && openDropdown(open)}
                  onKeyDown={(e) => onKeydown(e, open, close)}
                >
                  {selected.map((opt, ix) => (
                    <div className="select-result-item" key={getKey(opt, ix)}>
                      {getLabel(opt)}
                      <i
                        className="fa fa-times"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(ix);
                        }}
                      />
                    </div>
                  ))}
                </div>

                {children}
              </div>
            ),
          }}
        >
          {({ close }) => (
            <ul ref={dropdownRef}>
              {options.map((opt, index) => (
                <li
                  key={getKey(opt, index)}
                  className={useClassParser({
                    highlighted: index === highlightedIndex,
                  })}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectOption(opt, close);
                  }}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                >
                  {getLabel(opt)}
                </li>
              ))}
              {!options.length && <li>{noDataMsg}</li>}
            </ul>
          )}
        </FormDropdown>
      )}

      {!!errors?.length && (
        <p className="error-message">{errors.join(", ")}</p>
      )}
    </div>
  );
}
