import { useState } from "react";
import Calendar, { type CalendarRange } from "~/components/Calendar/Calendar";
import es from "~/components/Calendar/lang/es";
import { Example, Section } from "./_PlaygroundLayout";

// YYYY-MM-DD for the given day of the current month
function currentMonthDate(day: number) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${String(day).padStart(2, "0")}`;
}

const AVAILABLE_DATES = [3, 7, 10, 14, 18, 21, 25].map(currentMonthDate);
const DISABLED_DATES = [5, 6, 12, 13, 19, 20].map(currentMonthDate);
const CUSTOM_DATES = [
  { date: currentMonthDate(4), customClass: "date-success" },
  { date: currentMonthDate(11), customClass: "date-success" },
  { date: currentMonthDate(15), customClass: "date-danger" },
  { date: currentMonthDate(22), customClass: "date-weekend" },
];

export default function CalendarPlayground() {
  const [calendar, setCalendar] = useState<{
    basic: string | null;
    available: string | null;
    disabled: string | null;
    compact: string | null;
    spanish: string | null;
    range: CalendarRange | null;
  }>({
    basic: null,
    available: null,
    disabled: null,
    compact: null,
    spanish: null,
    range: null,
  });

  return (
    <Section title="Calendar" state={calendar}>
      <div className="row">
        <div className="col-lg-6">
          <Example title="Basic (bordered + mark today + range change)">
            <Calendar
              bordered
              markToday
              value={calendar.basic}
              onChange={(basic) => setCalendar((c) => ({ ...c, basic }))}
              onRangeChange={(range) => setCalendar((c) => ({ ...c, range }))}
            />
          </Example>
        </div>
        <div className="col-lg-6">
          <Example title="Available dates only">
            <Calendar
              bordered
              availableDates={AVAILABLE_DATES}
              value={calendar.available}
              onChange={(available) =>
                setCalendar((c) => ({ ...c, available }))
              }
            />
          </Example>
        </div>
        <div className="col-lg-6">
          <Example title="Disabled dates + custom classes">
            <Calendar
              bordered
              disabledDates={DISABLED_DATES}
              dates={CUSTOM_DATES}
              value={calendar.disabled}
              onChange={(disabled) => setCalendar((c) => ({ ...c, disabled }))}
            />
          </Example>
        </div>
        <div className="col-lg-6">
          <Example title="Compact">
            <Calendar
              compact
              bordered
              markToday
              value={calendar.compact}
              onChange={(compact) => setCalendar((c) => ({ ...c, compact }))}
            />
          </Example>
        </div>
        <div className="col-lg-6">
          <Example title="Custom lang (lang={es})">
            <Calendar
              bordered
              markToday
              lang={es}
              value={calendar.spanish}
              onChange={(spanish) => setCalendar((c) => ({ ...c, spanish }))}
            />
          </Example>
        </div>
      </div>
    </Section>
  );
}
