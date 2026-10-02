import { useEffect, useMemo, useRef, useState } from "react";
import { useClassParser } from "~/hooks/useClassParser";
import defaultLang, { type CalendarLang } from "./lang/en";
import "./_calendar.scss";

export type { CalendarLang };

export type CalendarDate = {
  date: string; // YYYY-MM-DD
  customClass?: string;
};

export type CalendarRange = {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
};

type CalendarProps = {
  value?: string | null; // YYYY-MM-DD
  availableDates?: string[] | null;
  disabledDates?: string[] | null;
  enabledByDefault?: boolean;
  dates?: CalendarDate[] | null;
  compact?: boolean;
  bordered?: boolean;
  markToday?: boolean;
  lang?: Partial<CalendarLang>; // Missing keys fall back to English
  onChange?: (date: string) => void;
  onRangeChange?: (range: CalendarRange) => void;
};

type CalendarCell = {
  date: string;
  dayNumber: number;
  isToday: boolean;
  isOutsideMonth: boolean;
  isEnabled: boolean;
  customClass: string | null;
};

const WEEKDAY_KEYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const satisfies readonly (keyof CalendarLang)[];

// Index + 1 is the month value (1-12)
const MONTH_KEYS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const satisfies readonly (keyof CalendarLang)[];

// "September" -> "sep", for the month picker grid
const shortMonth = (name: string) => name.slice(0, 3).toLowerCase();

const pad = (n: number) => String(n).padStart(2, "0");

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Strict YYYY-MM-DD parsing (rejects things like 2024-02-30)
function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

// Monday-first grid, completing only the weeks that intersect the month
function getGridBounds(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  // Convert getDay() (0 Sunday..6 Saturday) to Monday index (0..6)
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const endOffset = 6 - ((lastDayOfMonth.getDay() + 6) % 7); // days to add to reach Sunday

  return {
    gridStart: addDays(firstDayOfMonth, -startOffset),
    gridEnd: addDays(lastDayOfMonth, endOffset),
  };
}

function toValidSet(list?: string[] | null): Set<string> | null {
  if (!Array.isArray(list)) return null;
  return new Set(list.filter((d) => parseDate(d)));
}

export default function Calendar({
  value = null,
  availableDates = null,
  disabledDates = null,
  enabledByDefault = false,
  dates = null,
  compact = false,
  bordered = false,
  markToday = false,
  lang,
  onChange,
  onRangeChange,
}: CalendarProps) {
  const t = useMemo(() => ({ ...defaultLang, ...lang }), [lang]);

  const [selectedYear, setSelectedYear] = useState(
    () => parseDate(value)?.getFullYear() ?? new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    () => (parseDate(value)?.getMonth() ?? new Date().getMonth()) + 1, // 1-12
  );

  // Month/year picker opened from the header title
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(selectedYear);
  const pickerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLButtonElement>(null);
  const today = new Date();

  // Close the picker on click outside or Escape
  useEffect(() => {
    if (!pickerOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      // The title toggles the picker by itself
      if (titleRef.current?.contains(target)) return;
      if (!pickerRef.current?.contains(target)) setPickerOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPickerOpen(false);
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pickerOpen]);

  // Move the visible month to the selected value when it changes
  useEffect(() => {
    const date = parseDate(value);
    if (!date) return;
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth() + 1);
  }, [value]);

  // Keep the latest callback without re-triggering the range effect on every render
  const onRangeChangeRef = useRef(onRangeChange);
  useEffect(() => {
    onRangeChangeRef.current = onRangeChange;
  });

  // Debounce to avoid firing multiple backend requests while the user is changing month/year quickly.
  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;

    const timer = setTimeout(() => {
      const { gridStart, gridEnd } = getGridBounds(selectedYear, selectedMonth);
      onRangeChangeRef.current?.({
        from: formatDate(gridStart),
        to: formatDate(gridEnd),
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedYear, selectedMonth]);

  const availableSet = useMemo(
    () => toValidSet(availableDates),
    [availableDates],
  );
  const disabledSet = useMemo(() => toValidSet(disabledDates), [disabledDates]);

  const monthCells = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];

    const { gridStart, gridEnd } = getGridBounds(selectedYear, selectedMonth);
    const today = formatDate(new Date());
    const cells: CalendarCell[] = [];

    for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
      const date = formatDate(d);
      const isOutsideMonth = d.getMonth() !== selectedMonth - 1;

      let isEnabled = true;
      if (isOutsideMonth) {
        // Requirement: prev/next month days must not be clickable
        isEnabled = false;
      } else if (enabledByDefault) {
        isEnabled = true;
      } else if (availableSet) {
        isEnabled = availableSet.has(date);
      } else if (disabledSet) {
        isEnabled = !disabledSet.has(date);
      }

      cells.push({
        date,
        dayNumber: d.getDate(),
        isToday: date === today,
        isOutsideMonth,
        isEnabled,
        customClass: dates?.find((x) => x.date === date)?.customClass || null,
      });
    }

    return cells;
  }, [
    selectedYear,
    selectedMonth,
    enabledByDefault,
    availableSet,
    disabledSet,
    dates,
  ]);

  const onDayClick = (cell: CalendarCell) => {
    if (!cell.isEnabled) return;
    onChange?.(cell.date);
  };

  // Moves the visible month, wrapping the year when needed
  const shiftMonth = (delta: number) => {
    const date = new Date(selectedYear, selectedMonth - 1 + delta, 1);
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth() + 1);
  };

  const openPicker = () => {
    setPickerYear(selectedYear);
    setPickerOpen(true);
  };

  const pickMonth = (month: number) => {
    setSelectedYear(pickerYear);
    setSelectedMonth(month);
    setPickerOpen(false);
  };

  return (
    <div
      className={useClassParser({
        "calendar-component": true,
        "calendar-component-compact": compact,
        "calendar-component-bordered": bordered,
      })}
    >
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav"
          aria-label="Previous month"
          onClick={() => shiftMonth(-1)}
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        <button
          type="button"
          ref={titleRef}
          className="calendar-title"
          onClick={() => (pickerOpen ? setPickerOpen(false) : openPicker())}
        >
          {t[MONTH_KEYS[selectedMonth - 1]]} {selectedYear}
        </button>

        <button
          type="button"
          className="calendar-nav"
          aria-label="Next month"
          onClick={() => shiftMonth(1)}
        >
          <i className="fa-solid fa-chevron-right" />
        </button>

        {pickerOpen && (
          <div className="calendar-picker" ref={pickerRef}>
            <div className="calendar-picker-header">
              <button
                type="button"
                className="calendar-nav"
                aria-label="Previous year"
                onClick={() => setPickerYear((y) => y - 1)}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
              <span className="calendar-picker-year">{pickerYear}</span>
              <button
                type="button"
                className="calendar-nav"
                aria-label="Next year"
                onClick={() => setPickerYear((y) => y + 1)}
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>

            <div className="calendar-picker-months">
              {MONTH_KEYS.map((key, i) => (
                <button
                  key={key}
                  type="button"
                  className={[
                    "calendar-picker-month",
                    pickerYear === selectedYear &&
                      i + 1 === selectedMonth &&
                      "selected",
                    pickerYear === today.getFullYear() &&
                      i === today.getMonth() &&
                      "current",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => pickMonth(i + 1)}
                >
                  {shortMonth(t[key])}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="calendar-weekdays">
        {WEEKDAY_KEYS.map((key) => (
          <div key={key} className="calendar-weekday">
            {t[key]}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {monthCells.map((cell) => (
          <div
            key={cell.date}
            className={[
              "calendar-day",
              value === cell.date && "selected",
              !cell.isEnabled && "disabled",
              cell.isOutsideMonth && "outside",
              cell.isToday && markToday && "today",
              cell.customClass,
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onDayClick(cell)}
          >
            <span className="day-number">{cell.dayNumber}</span>
          </div>
        ))}
      </div>

      {monthCells.length === 0 && (
        <div className="calendar-empty">
          <i className="fas fa-calendar-times"></i>
          <span>{t.noDates}</span>
        </div>
      )}
    </div>
  );
}
