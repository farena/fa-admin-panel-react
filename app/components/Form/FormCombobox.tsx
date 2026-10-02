import { useClassParser } from "~/hooks/useClassParser";
import FormDropdown from "./FormDropdown";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import debounce from "~/utils/debounce";
import FormIcon from "./FormIcon";

type OptionRecord = {
  label: string;
  value: string | object;
};

interface FormComboboxProps<OptionRecord> {
  value: Array<OptionRecord> | OptionRecord | null;
  label?: string;
  placeholder?: string;
  icon?: string;
  iconMaterial?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  flexField?: boolean;
  keepOpen?: boolean;
  newOption?: string;
  minLen?: number;
  noDataMsg?: string;
  options: Array<OptionRecord>;
  children?: ReactNode;
  optionGetter: (search: string | null) => void;
  onChange: (value: Array<OptionRecord> | OptionRecord) => void;
  onFocus: () => void;
}

export default function FormCombobox({
  value,
  label,
  placeholder,
  icon,
  iconMaterial = false,
  multiple = false,
  disabled = false,
  flexField = false,
  keepOpen = false,
  newOption,
  minLen,
  noDataMsg,
  options,
  children,
  optionGetter,
  onChange,
  onFocus,
}: FormComboboxProps<OptionRecord>) {
  const id = useId();
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownOpen = useRef(false);
  // Mirrors dropdownOpen to re-render the wrapper classes
  const [isOpen, setIsOpen] = useState(false);
  const fullSearched = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<Array<HTMLElement | null>>([]);
  const optGetterRef = useRef<((search: string | null) => void) | undefined>(
    undefined,
  );

  useEffect(() => {
    optGetterRef.current = debounce({
      callback: optionGetter,
      delay: 500,
      startedCallback: () => {
        setIsLoading(true);
      },
      finalCallback: () => {
        setIsLoading(false);
      },
    });
  }, [optionGetter]);

  const fullSearch = () => {
    if (fullSearched.current) return;

    fullSearched.current = true;
    optGetterRef.current?.(null);
  };

  const openDropdown = (
    open: () => void,
    e?: SyntheticEvent<HTMLInputElement>,
  ) => {
    e?.stopPropagation();
    if (dropdownOpen.current) return;

    dropdownOpen.current = true;
    setIsOpen(true);
    open();
    fullSearch();
  };

  const closeDropdown = (close: () => void) => {
    setTimeout(() => {
      close();
      dropdownOpen.current = !!keepOpen;
      setIsOpen(!!keepOpen);
      setHighlightedIndex(-1);
    }, 100); // Small delay to allow click event to register
  };

  const onFocusInput = (open: () => void) => {
    onFocus();
    openDropdown(open);
  };

  const onSearch = (val: string) => {
    setSearchValue(val);

    if (!val || val === "") {
      fullSearch();
    } else if (val.length >= (minLen ?? 0)) {
      fullSearched.current = false;
      optGetterRef.current?.(val);
    }
  };

  const selectOption = (option: OptionRecord, close: () => void) => {
    closeDropdown(close);

    if (multiple) {
      setSearchValue("");

      const current = Array.isArray(value) ? value : [];
      if (option.value === "new") {
        onChange([
          ...current,
          {
            ...option,
            label: option.label.slice(newOption?.length ?? 0),
          },
        ]);
      } else {
        onChange([...current, option]);
      }
    } else {
      setSearchValue(option.label);
      onChange(option);
    }
  };

  const removeOption = (index: number) => {
    if (!Array.isArray(value)) return;

    onChange(value.filter((_, ix) => ix !== index));
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
    e: KeyboardEvent<HTMLInputElement>,
    open: () => void,
    close: () => void,
  ) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!dropdownOpen.current) return;

        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!dropdownOpen.current) return;

        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter": {
        e.preventDefault();
        if (!dropdownOpen.current) {
          openDropdown(open, e);
          return;
        }

        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          selectOption(options[highlightedIndex], close);
        }
        break;
      }
    }
  };

  return (
    <div
      className={useClassParser({
        "form-container form-combobox": true,
        disabled,
        "flex-field": flexField,
        "keep-open": keepOpen,
        "form-combobox-multiple": multiple,
      })}
    >
      {label && <label>{label}</label>}

      <FormDropdown
        parentEl={`#form_wrapper_${id}`}
        keepOpen={keepOpen}
        slots={{
          action: ({ open, close }) => (
            <div
              className={useClassParser({
                "form-wrapper": true,
                "dropdown-open": isOpen,
                "with-selection": Array.isArray(value) && value.length > 0,
              })}
              id={`form_wrapper_${id}`}
            >
              <FormIcon icon={icon} iconMaterial={iconMaterial} as="div" />

              <input
                type="text"
                value={searchValue}
                id={id}
                onClick={(e) => openDropdown(open, e)}
                onFocus={() => onFocusInput(open)}
                onBlur={() => closeDropdown(close)}
                onChange={(e) => onSearch(e.target.value)}
                onKeyDown={(e) => onKeydown(e, open, close)}
                ref={input}
                autoComplete="new-combobox"
                placeholder={placeholder}
              />
              {multiple && (
                <div className="search-btn">
                  <i className="fa-solid fa-magnifying-glass" />
                </div>
              )}

              {multiple && Array.isArray(value) && (
                <div className="options-result">
                  {value.map((opt, ix) => (
                    <div
                      className="select-result-item"
                      key={typeof opt.value === "string" ? opt.value : ix}
                    >
                      {opt.label}
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
              )}

              {isLoading && (
                <div className="loader">
                  <div className="spinner"></div>
                </div>
              )}

              {children}
            </div>
          ),
        }}
      >
        {({ close }) => (
          <ul ref={dropdownRef}>
            {options.map((option, index) => (
              <li
                key={typeof option.value === "string" ? option.value : index}
                className={useClassParser({
                  highlighted: index === highlightedIndex,
                })}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(option, close);
                }}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
              >
                {option.label}
              </li>
            ))}
            {!options.length && <li>{noDataMsg}</li>}
          </ul>
        )}
      </FormDropdown>
    </div>
  );
}
