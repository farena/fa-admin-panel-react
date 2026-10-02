import { useEffect, useId, useMemo, useState } from "react";
import { useClassParser } from "~/hooks/useClassParser";
import { useFocusDropdown } from "~/hooks/useFocusDropdown";
import Calendar, {
  type CalendarDate,
  type CalendarLang,
} from "~/components/Calendar/Calendar";
import {
  useCalendarRestrictions,
  type CalendarRestrictions,
} from "~/components/Calendar/useCalendarRestrictions";
import {
  addDays,
  addMonths,
  parseDate,
  parseToString,
  startOfDay,
  toDmy,
  toHm,
  toYmd,
} from "~/utils/date";
import FormDropdown from "./FormDropdown";
import FormTime from "./FormTime";

export type DateRangeValue = {
  start: string | null; // YYYY-MM-DD, or YYYY-MM-DD HH:mm with dateTime
  end: string | null;
};

// Shortcut that sets the end relative to the start (or today when there's no start)
export type CustomDateRange = {
  label: string;
  qty: number;
  unit: "days" | "weeks" | "months" | "years";
};

type Edge = "start" | "end";

type FormDateRangeProps = CalendarRestrictions & {
  value: DateRangeValue | null;
  label?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  dateTime?: boolean;
  flexField?: boolean;
  customRanges?: CustomDateRange[];
  errors?: string[];
  lang?: Partial<CalendarLang>; // Calendar texts, English by default
  onChange: (value: DateRangeValue) => void;
};

// Times used when a day is picked before any time was chosen
const DEFAULT_TIME: Record<Edge, string> = { start: "00:00", end: "23:59" };

// The value the inputs show: DD-MM-YYYY [HH:mm]
const formatDisplay = (date: Date | null, dateTime: boolean) => {
  if (!date) return "";
  return dateTime ? `${toDmy(date)} ${toHm(date)}` : toDmy(date);
};

const withTime = (ymd: string, time: string, dateTime: boolean) =>
  parseDate(dateTime ? `${ymd} ${time}` : ymd, dateTime);

function shiftDate(date: Date, { qty, unit }: CustomDateRange): Date {
  switch (unit) {
    case "days":
      return addDays(date, qty);
    case "weeks":
      return addDays(date, qty * 7);
    case "months":
      return addMonths(date, qty);
    case "years":
      return addMonths(date, qty * 12);
  }
}

export default function FormDateRange({
  value,
  label,
  startPlaceholder,
  endPlaceholder,
  disabled = false,
  dateTime = false,
  flexField = false,
  customRanges = [],
  errors,
  lang,
  onChange,
  ...restrictions
}: FormDateRangeProps) {
  const id = useId();
  const calendar = useCalendarRestrictions(restrictions);
  const dropdownFocus = useFocusDropdown();

  const start = parseDate(value?.start, dateTime);
  const end = parseDate(value?.end, dateTime);

  // Which edge the next calendar click sets
  const [selecting, setSelecting] = useState<Edge>("start");
  // Date the calendar keeps in view (YYYY-MM-DD)
  const [focusDate, setFocusDate] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<Edge, string>>({
    start: "",
    end: "",
  });
  const [times, setTimes] = useState<Record<Edge, string>>(DEFAULT_TIME);

  useEffect(() => {
    setInputs({
      start: formatDisplay(start, dateTime),
      end: formatDisplay(end, dateTime),
    });
    setTimes((prev) => ({
      start: start && dateTime ? toHm(start) : prev.start,
      end: end && dateTime ? toHm(end) : prev.end,
    }));
    setFocusDate((prev) => prev ?? (start ? toYmd(start) : null));
  }, [value?.start, value?.end, dateTime]);

  const emit = (newStart: Date | null, newEnd: Date | null) => {
    // Keep the range ordered, whatever edge the user edited
    if (newStart && newEnd && newStart > newEnd) {
      [newStart, newEnd] = [newEnd, newStart];
    }

    onChange({
      start: parseToString(newStart, dateTime),
      end: parseToString(newEnd, dateTime),
    });
  };

  // Highlights the range days within the visible grid
  const rangeDates = useMemo(() => {
    const from = parseDate(calendar.visibleRange?.from);
    const to = parseDate(calendar.visibleRange?.to);
    if (!from || !to || !start) return [];

    const startYmd = toYmd(start);
    const endYmd = end ? toYmd(end) : startYmd;
    const out: CalendarDate[] = [];

    for (let d = from; d <= to; d = addDays(d, 1)) {
      const date = toYmd(d);
      if (date < startYmd || date > endYmd) continue;

      const classes = ["in-range"];
      if (date === startYmd) classes.push("range-start");
      if (date === endYmd) classes.push("range-end");
      out.push({ date, customClass: classes.join(" ") });
    }

    return out;
  }, [calendar.visibleRange, value?.start, value?.end, dateTime]);

  const openDropdown = (edge: Edge, open: () => void) => {
    if (disabled) return;

    const edgeDate = edge === "start" ? start : end;
    setSelecting(edge);
    if (edgeDate) setFocusDate(toYmd(edgeDate));
    open();
  };

  const onBlurInput = (edge: Edge) => {
    const current = edge === "start" ? start : end;
    const text = inputs[edge].trim();
    if (text === formatDisplay(current, dateTime)) return;

    const date = text ? parseDate(text, dateTime) : null;
    if (text && !date) {
      // Invalid input, restore the current value
      setInputs((prev) => ({
        ...prev,
        [edge]: formatDisplay(current, dateTime),
      }));
      return;
    }

    if (edge === "start") emit(date, end);
    else emit(start, date);
  };

  const onDayClick = (ymd: string, close: () => void) => {
    setFocusDate(ymd);

    if (selecting === "start" || !start) {
      const newStart = withTime(ymd, times.start, dateTime);
      // Drop the end when the new start leaves it behind
      emit(newStart, end && newStart && end >= newStart ? end : null);
      setSelecting("end");
      return;
    }

    // Picking an end before the start restarts the range from that day
    if (ymd < toYmd(start)) {
      emit(withTime(ymd, times.start, dateTime), null);
      return;
    }

    emit(start, withTime(ymd, times.end, dateTime));
    setSelecting("start");
    if (!dateTime) close();
  };

  const onTimeChange = (edge: Edge, time: string) => {
    setTimes((prev) => ({ ...prev, [edge]: time }));

    const edgeDate = edge === "start" ? start : end;
    if (!edgeDate) return;

    const newDate = withTime(toYmd(edgeDate), time, dateTime);
    if (edge === "start") emit(newDate, end);
    else emit(start, newDate);
  };

  const applyCustomRange = (range: CustomDateRange, close: () => void) => {
    const base = start ?? (dateTime ? new Date() : startOfDay(new Date()));
    const newEnd = shiftDate(base, range);

    emit(base, newEnd);
    setFocusDate(toYmd(newEnd));
    setSelecting("start");
    close();
  };

  const renderInput = (edge: Edge, open: () => void, close: () => void) => (
    <div className="form-wrapper">
      {!flexField && (
        <div className="icon">
          <i className="fa-solid fa-calendar-day" />
        </div>
      )}
      <input
        id={edge === "start" ? id : undefined}
        type="text"
        value={inputs[edge]}
        placeholder={edge === "start" ? startPlaceholder : endPlaceholder}
        disabled={disabled}
        autoComplete="off"
        onFocus={() => openDropdown(edge, open)}
        onClick={(e) => {
          e.stopPropagation();
          openDropdown(edge, open);
        }}
        onBlur={(e) => {
          onBlurInput(edge);
          dropdownFocus.onFieldBlur(e, close);
        }}
        onChange={(e) =>
          setInputs((prev) => ({ ...prev, [edge]: e.target.value }))
        }
      />
    </div>
  );

  return (
    <div
      className={useClassParser({
        "form-container form-date form-date-range": true,
        disabled,
        "flex-field": flexField,
        "input-error": !!errors?.length,
      })}
    >
      {label && <label htmlFor={id}>{label}</label>}

      <FormDropdown
        className="form-date-dropdown form-date-range-dropdown"
        parentEl={`#formdaterange_wrapper_${id}`}
        slots={{
          action: ({ open, close }) => (
            <div
              className="d-grid grid-2-cols gap-2"
              id={`formdaterange_wrapper_${id}`}
              ref={dropdownFocus.fieldRef}
            >
              {renderInput("start", open, close)}
              {renderInput("end", open, close)}
            </div>
          ),
        }}
      >
        {({ close }) => (
          <div {...dropdownFocus.contentProps(close)}>
            <div className="form-date-dropdown-wrapper">
              <Calendar
                value={focusDate}
                lang={lang}
                dates={rangeDates}
                availableDates={calendar.availableDates}
                disabledDates={calendar.disabledDates}
                onRangeChange={calendar.onRangeChange}
                onChange={(date) => onDayClick(date, close)}
              />

              {dateTime && (
                <div className="form-date-range-times">
                  {(["start", "end"] as const).map((edge) => (
                    <div key={edge}>
                      <small>{edge === "start" ? "Start" : "End"}</small>
                      <FormTime
                        value={times[edge]}
                        disabled={disabled}
                        onChange={(time) => onTimeChange(edge, time)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {customRanges.length > 0 && (
              <div className="form-date-ranges">
                {customRanges.map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => applyCustomRange(range, close)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </FormDropdown>

      {!!errors?.length && <p className="error-message">{errors.join(", ")}</p>}
    </div>
  );
}
