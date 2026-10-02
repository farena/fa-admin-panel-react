import { useEffect, useId, useState } from "react";
import { useClassParser } from "~/hooks/useClassParser";
import { useFocusDropdown } from "~/hooks/useFocusDropdown";
import Calendar, { type CalendarLang } from "~/components/Calendar/Calendar";
import {
  useCalendarRestrictions,
  type CalendarRestrictions,
} from "~/components/Calendar/useCalendarRestrictions";
import { parseDate, parseToString, toDmy, toHm, toYmd } from "~/utils/date";
import FormDropdown from "./FormDropdown";
import FormTime from "./FormTime";

export type { DateRange } from "~/components/Calendar/useCalendarRestrictions";

type FormDateProps = CalendarRestrictions & {
  value: string | null; // YYYY-MM-DD, or YYYY-MM-DD HH:mm with dateTime
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  dateTime?: boolean;
  flexField?: boolean;
  errors?: string[];
  lang?: Partial<CalendarLang>; // Calendar texts, English by default
  onChange: (value: string | null) => void;
};

// The value the input shows: DD-MM-YYYY [HH:mm]
function formatDisplay(
  datePart: string,
  timePart: string | null,
  dateTime: boolean,
) {
  const raw = dateTime ? `${datePart} ${timePart || "00:00"}` : datePart;
  const date = parseDate(raw, dateTime);
  if (!date) return null;

  return dateTime ? `${toDmy(date)} ${toHm(date)}` : toDmy(date);
}

export default function FormDate({
  value,
  label,
  placeholder,
  disabled = false,
  dateTime = false,
  disabledDates,
  availableDates,
  disabledWeekdays,
  disabledRanges,
  minDate,
  maxDate,
  flexField = false,
  errors,
  lang,
  onChange,
}: FormDateProps) {
  const id = useId();
  const dropdownFocus = useFocusDropdown();
  const [datePart, setDatePart] = useState<string | null>(null); // YYYY-MM-DD
  const [timePart, setTimePart] = useState<string | null>(null); // HH:mm
  const [inputValue, setInputValue] = useState("");
  const [previousValidInput, setPreviousValidInput] = useState("");

  const syncFromDate = (date: Date) => {
    const newDatePart = toYmd(date);
    const newTimePart = dateTime ? toHm(date) : null;
    const display = formatDisplay(newDatePart, newTimePart, dateTime) ?? "";

    setDatePart(newDatePart);
    setTimePart(newTimePart);
    setInputValue(display);
    setPreviousValidInput(display);
  };

  useEffect(() => {
    if (!value) {
      setDatePart(null);
      setTimePart(null);
      setInputValue("");
      setPreviousValidInput("");
      return;
    }

    const date = parseDate(value, dateTime);
    if (date) syncFromDate(date);
  }, [value, dateTime]);

  const calendar = useCalendarRestrictions({
    disabledDates,
    availableDates,
    disabledWeekdays,
    disabledRanges,
    minDate,
    maxDate,
  });

  const emitChange = (
    newDatePart: string | null,
    newTimePart: string | null,
  ) => {
    if (!newDatePart) {
      onChange(null);
      return;
    }

    const time = dateTime ? newTimePart || toHm(new Date()) : null;
    const raw = dateTime ? `${newDatePart} ${time}` : newDatePart;

    const date = parseDate(raw, dateTime);
    if (!date) return;

    syncFromDate(date);
    onChange(parseToString(date, dateTime));
  };

  const parentValueHasTime = () =>
    !!value && /\s\d{1,2}:\d{2}$/.test(value.trim());

  const openDropdown = (open: () => void) => {
    if (disabled) return;

    open();

    // Only default to current time when parent did not provide a time
    if (dateTime && !timePart && !parentValueHasTime()) {
      setTimePart(toHm(new Date()));
    }
  };

  const onBlurInput = () => {
    if (!inputValue.trim()) {
      setDatePart(null);
      setTimePart(null);
      emitChange(null, null);
      return;
    }

    const date = parseDate(inputValue, dateTime);
    if (!date) {
      setInputValue(previousValidInput);
      return;
    }

    emitChange(toYmd(date), dateTime ? toHm(date) : null);
  };

  return (
    <div
      className={useClassParser({
        "form-container form-date": true,
        disabled,
        "flex-field": flexField,
        "input-error": !!errors?.length,
      })}
    >
      {label && <label htmlFor={id}>{label}</label>}

      <FormDropdown
        className="form-date-dropdown"
        parentEl={`#formdate_wrapper_${id}`}
        slots={{
          action: ({ open, close }) => (
            <div
              className="form-wrapper"
              id={`formdate_wrapper_${id}`}
              ref={dropdownFocus.fieldRef}
            >
              {!flexField && (
                <div className="icon">
                  <i className="fa-solid fa-calendar-day" />
                </div>
              )}
              <input
                id={id}
                type="text"
                value={inputValue}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                onFocus={() => openDropdown(open)}
                onClick={(e) => {
                  e.stopPropagation();
                  openDropdown(open);
                }}
                onBlur={(e) => {
                  onBlurInput();
                  dropdownFocus.onFieldBlur(e, close);
                }}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          ),
        }}
      >
        {({ close }) => (
          <div
            className="form-date-dropdown-wrapper"
            {...dropdownFocus.contentProps(close)}
          >
            <Calendar
              value={datePart}
              lang={lang}
              availableDates={calendar.availableDates}
              disabledDates={calendar.disabledDates}
              onRangeChange={calendar.onRangeChange}
              onChange={(date) => {
                emitChange(date, timePart);
                if (!dateTime) close();
              }}
            />

            {dateTime && (
              <FormTime
                value={timePart}
                disabled={disabled}
                // Stays open while editing hour/minute; closes once the focus leaves
                onChange={(time) => {
                  setTimePart(time);
                  emitChange(datePart, time);
                }}
              />
            )}
          </div>
        )}
      </FormDropdown>

      {!!errors?.length && <p className="error-message">{errors.join(", ")}</p>}
    </div>
  );
}
