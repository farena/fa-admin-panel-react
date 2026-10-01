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

  const yearsList = useMemo(() => {
    const years = new Set([new Date().getFullYear()]);

    const addYearsFromList = (list?: string[] | null) => {
      if (!Array.isArray(list)) return;
      list.forEach((d) => {
        const date = parseDate(d);
        if (date) years.add(date.getFullYear());
      });
    };

    addYearsFromList(availableDates);
    addYearsFromList(disabledDates);

    // Ensure we have a reasonable range even when no lists are provided
    const minYear = Math.min(...years) - 1;
    const maxYear = Math.max(...years) + 1;
    for (let y = minYear; y <= maxYear; y++) years.add(y);

    return Array.from(years).sort((a, b) => a - b);
  }, [availableDates, disabledDates]);

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

  return (
    <div
      className={useClassParser({
        "calendar-component": true,
        "calendar-component-compact": compact,
        "calendar-component-bordered": bordered,
      })}
    >
      <div className="calendar-header">
        <div className="calendar-controls">
          <select
            className="calendar-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {yearsList.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            className="calendar-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {MONTH_KEYS.map((key, i) => (
              <option key={key} value={i + 1}>
                {t[key]}
              </option>
            ))}
          </select>
        </div>
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
