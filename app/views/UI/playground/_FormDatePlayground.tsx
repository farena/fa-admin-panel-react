import { useState } from "react";
import FormDate from "~/components/Form/FormDate";
import { addDays, toYmd } from "~/utils/date";
import { Example, Section } from "./_PlaygroundLayout";

// YYYY-MM-DD for the given day of the current month
function currentMonthDate(day: number) {
  const now = new Date();
  return toYmd(new Date(now.getFullYear(), now.getMonth(), day));
}

const AVAILABLE_DATES = [3, 7, 10, 14, 18, 21, 25].map(currentMonthDate);
const DISABLED_RANGES = [
  { start: currentMonthDate(10), end: currentMonthDate(15) },
];
const TODAY = new Date();
const MIN_DATE = addDays(TODAY, -3);
const MAX_DATE = addDays(TODAY, 10);

export default function FormDatePlayground() {
  const [dates, setDates] = useState<Record<string, string | null>>({
    basic: null,
    dateTime: "2026-01-15 09:30",
    available: null,
    weekdays: null,
    minMax: null,
    disabled: "2026-01-15",
    error: null,
  });

  const field = (key: string) => ({
    value: dates[key],
    onChange: (val: string | null) => setDates((d) => ({ ...d, [key]: val })),
  });

  return (
    <Section title="FormDate" state={dates}>
      <Example title="Basic (type DD-MM-YYYY or YYYY-MM-DD and blur)">
        <FormDate label="Date" placeholder="DD-MM-YYYY" {...field("basic")} />
      </Example>
      <Example title="Date time">
        <FormDate label="Date and time" dateTime {...field("dateTime")} />
      </Example>
      <Example title="Available dates only">
        <FormDate
          label="Delivery date"
          availableDates={AVAILABLE_DATES}
          {...field("available")}
        />
      </Example>
      <Example title="Disabled weekends + disabled range (10th to 15th)">
        <FormDate
          label="Appointment"
          disabledWeekdays={[0, 6]}
          disabledRanges={DISABLED_RANGES}
          {...field("weekdays")}
        />
      </Example>
      <Example title="Min / max date (3 days ago to 10 days ahead)">
        <FormDate
          label="Booking"
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
          {...field("minMax")}
        />
      </Example>
      <Example title="Disabled">
        <FormDate label="Disabled" disabled {...field("disabled")} />
      </Example>
      <Example title="With errors">
        <FormDate label="Due date" errors={["Required"]} {...field("error")} />
      </Example>
    </Section>
  );
}
