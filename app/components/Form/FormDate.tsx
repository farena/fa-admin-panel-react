import { useEffect, useId, useMemo, useState } from "react";
import { useClassParser } from "~/hooks/useClassParser";
import Calendar, { type CalendarRange } from "~/components/Calendar/Calendar";
import {
  addDays,
  parseDate,
  parseToString,
  startOfDay,
  toDmy,
  toHm,
  toYmd,
} from "~/utils/date";
import FormDropdown from "./FormDropdown";
import FormTime from "./FormTime";

export type DateRange = {
  start: string; // YYYY-MM-DD or DD-MM-YYYY
  end: string;
};

type FormDateProps = {
  value: string | null; // YYYY-MM-DD, or YYYY-MM-DD HH:mm with dateTime
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  dateTime?: boolean;
  disabledDates?: string[] | null; // YYYY-MM-DD
  availableDates?: string[] | null; // YYYY-MM-DD, when set only these dates are enabled
  disabledWeekdays?: number[] | null; // 0 Sunday ... 6 Saturday
  disabledRanges?: DateRange[] | null;
  minDate?: Date | null;
  maxDate?: Date | null;
  flexField?: boolean;
  errors?: string[];
  onChange: (value: string | null) => void;
};

// The value the input shows: DD-MM-YYYY [HH:mm]
function formatDisplay(datePart: string, timePart: string | null, dateTime: boolean) {
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
  onChange,
}: FormDateProps) {
  const id = useId();
  const [datePart, setDatePart] = useState<string | null>(null); // YYYY-MM-DD
  const [timePart, setTimePart] = useState<string | null>(null); // HH:mm
  const [inputValue, setInputValue] = useState("");
  const [previousValidInput, setPreviousValidInput] = useState("");
  const [visibleRange, setVisibleRange] = useState<CalendarRange | null>(null);

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

  const calendarAvailableDates = useMemo(() => {
    if (!availableDates?.length) return null;

    const out = availableDates
      .map((d) => parseDate(d))
      .filter((d): d is Date => !!d)
      .map(toYmd);

    return out.length ? out : null;
  }, [availableDates]);

  const calendarDisabledDates = useMemo(() => {
    // When availableDates is set, only those dates are shown (Calendar handles it); no disabled list
    if (calendarAvailableDates) return [];

    const result = new Set<string>();

    disabledDates?.forEach((d) => {
      const date = parseDate(d);
      if (date) result.add(toYmd(date));
    });

    const weekdays = disabledWeekdays ?? [];
    const ranges = (disabledRanges ?? [])
      .map((r) => ({ start: parseDate(r.start), end: parseDate(r.end) }))
      .filter((r): r is { start: Date; end: Date } => !!r.start && !!r.end);
    const min = minDate ? toYmd(startOfDay(minDate)) : null;
    const max = maxDate ? toYmd(startOfDay(maxDate)) : null;

    const from = parseDate(visibleRange?.from);
    const to = parseDate(visibleRange?.to);

    if (
      from &&
      to &&
      (weekdays.length > 0 || ranges.length > 0 || min || max)
    ) {
      for (let d = from; d <= to; d = addDays(d, 1)) {
        const dateStr = toYmd(d);

        if (weekdays.includes(d.getDay())) result.add(dateStr);
        if (ranges.some((r) => d >= r.start && d <= r.end)) result.add(dateStr);
        // YYYY-MM-DD strings compare chronologically
        if (min && dateStr < min) result.add(dateStr);
        if (max && dateStr > max) result.add(dateStr);
      }
    }

    return Array.from(result);
  }, [
    calendarAvailableDates,
    disabledDates,
    disabledWeekdays,
    disabledRanges,
    minDate,
    maxDate,
    visibleRange,
  ]);

  const emitChange = (newDatePart: string | null, newTimePart: string | null) => {
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

  const onClickInput = (open: () => void) => {
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
        parentEl={`#formdate_wrapper_${id}`}
        slots={{
          action: ({ open }) => (
            <div className="form-wrapper" id={`formdate_wrapper_${id}`}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  onClickInput(open);
                }}
                onBlur={onBlurInput}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          ),
        }}
      >
        {({ close }) => (
          <div className="form-date-dropdown-wrapper">
            <Calendar
              value={datePart}
              availableDates={calendarAvailableDates}
              disabledDates={calendarDisabledDates}
              onRangeChange={setVisibleRange}
              onChange={(date) => {
                emitChange(date, timePart);
                if (!dateTime) close();
              }}
            />

            {dateTime && (
              <FormTime
                value={timePart}
                disabled={disabled}
                onChange={(time) => {
                  setTimePart(time);
                  emitChange(datePart, time);
                  close();
                }}
              />
            )}
          </div>
        )}
      </FormDropdown>

      {!!errors?.length && (
        <p className="error-message">{errors.join(", ")}</p>
      )}
    </div>
  );
}
