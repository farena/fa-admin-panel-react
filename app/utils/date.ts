const pad = (n: number) => String(n).padStart(2, "0");

const DATE_FORMATS = [
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})(?: (?<hour>\d{1,2}):(?<minute>\d{2}))?$/, // YYYY-MM-DD [HH:mm]
  /^(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})(?: (?<hour>\d{1,2}):(?<minute>\d{2}))?$/, // DD-MM-YYYY [HH:mm]
];

/**
 * Strict parsing of "YYYY-MM-DD" / "DD-MM-YYYY", with an optional " HH:mm".
 * Rejects impossible dates like 2024-02-30. When `isDateTime` is false the time is dropped.
 */
export function parseDate(
  value: string | Date | null | undefined,
  isDateTime = false,
): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return isDateTime ? new Date(value) : startOfDay(value);
  }

  const groups = DATE_FORMATS.map((reg) => reg.exec(value.trim())).find(
    Boolean,
  )?.groups;
  if (!groups) return null;

  const year = Number(groups.year);
  const month = Number(groups.month);
  const day = Number(groups.day);
  const hour = isDateTime && groups.hour ? Number(groups.hour) : 0;
  const minute = isDateTime && groups.minute ? Number(groups.minute) : 0;

  if (hour > 23 || minute > 59) return null;

  const date = new Date(year, month - 1, day, hour, minute);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

// YYYY-MM-DD
export function toYmd(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// DD-MM-YYYY
export function toDmy(date: Date): string {
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

// HH:mm
export function toHm(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// "YYYY-MM-DD" or "YYYY-MM-DD HH:mm", the format the backend expects
export function parseToString(
  date: Date | null,
  isDateTime = false,
): string | null {
  if (!date) return null;

  return isDateTime ? `${toYmd(date)} ${toHm(date)}` : toYmd(date);
}
