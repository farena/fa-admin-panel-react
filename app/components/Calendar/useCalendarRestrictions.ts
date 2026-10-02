import { useMemo, useState } from "react";
import { addDays, parseDate, startOfDay, toYmd } from "~/utils/date";
import type { CalendarRange } from "./Calendar";

export type DateRange = {
  start: string; // YYYY-MM-DD or DD-MM-YYYY
  end: string;
};

export type CalendarRestrictions = {
  disabledDates?: string[] | null; // YYYY-MM-DD
  availableDates?: string[] | null; // YYYY-MM-DD, when set only these dates are enabled
  disabledWeekdays?: number[] | null; // 0 Sunday ... 6 Saturday
  disabledRanges?: DateRange[] | null;
  minDate?: Date | null;
  maxDate?: Date | null;
};

/**
 * Turns the form-level restrictions into the plain date lists the Calendar expects.
 * Weekdays, ranges and min/max are expanded only for the grid currently visible,
 * so `onRangeChange` must be wired to the Calendar.
 */
export function useCalendarRestrictions({
  disabledDates,
  availableDates,
  disabledWeekdays,
  disabledRanges,
  minDate,
  maxDate,
}: CalendarRestrictions) {
  const [visibleRange, setVisibleRange] = useState<CalendarRange | null>(null);

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

  return {
    availableDates: calendarAvailableDates,
    disabledDates: calendarDisabledDates,
    visibleRange,
    onRangeChange: setVisibleRange,
  };
}
