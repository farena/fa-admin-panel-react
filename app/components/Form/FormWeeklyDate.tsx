import { useClassParser } from "~/hooks/useClassParser";
import "./_form_weekly_date.scss";

type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

// ISO weekday numbers: 1 = Monday ... 7 = Sunday
const DAYS: { key: WeekdayKey; value: number }[] = [
  { key: "mon", value: 1 },
  { key: "tue", value: 2 },
  { key: "wed", value: 3 },
  { key: "thu", value: 4 },
  { key: "fri", value: 5 },
  { key: "sat", value: 6 },
  { key: "sun", value: 7 },
];

const DEFAULT_LABELS: Record<WeekdayKey, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

type FormWeeklyDateProps = {
  value: number[];
  label?: string;
  description?: string;
  disabled?: boolean;
  lang?: Partial<Record<WeekdayKey, string>>; // Missing keys fall back to English
  onChange: (value: number[]) => void;
};

export default function FormWeeklyDate({
  value,
  label,
  description,
  disabled = false,
  lang,
  onChange,
}: FormWeeklyDateProps) {
  const labels = { ...DEFAULT_LABELS, ...lang };

  const toggleDay = (day: number) => {
    if (disabled) return;

    const selected = value.includes(day)
      ? value.filter((x) => x !== day)
      : [...value, day];

    onChange(selected.sort((a, b) => a - b));
  };

  return (
    <div className={useClassParser({ "weekday-selector": true, disabled })}>
      {label && <label className="selector-label">{label}</label>}
      <div className="day-container">
        {DAYS.map((day) => {
          const isSelected = value.includes(day.value);

          return (
            <div
              key={day.value}
              className={useClassParser({
                "day-cell": true,
                selected: isSelected,
              })}
              onClick={() => toggleDay(day.value)}
            >
              <div className="day-content">
                <div className="day-name">{labels[day.key]}</div>
                <div className="day-checkbox">
                  <i
                    className={
                      isSelected ? "fas fa-check-circle" : "far fa-circle"
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {description && <small className="text-muted">{description}</small>}
    </div>
  );
}
