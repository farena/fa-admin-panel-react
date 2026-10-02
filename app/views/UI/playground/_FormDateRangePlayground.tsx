import { useState } from "react";
import FormDateRange, {
  type CustomDateRange,
  type DateRangeValue,
} from "~/components/Form/FormDateRange";
import es from "~/components/Calendar/lang/es";
import { addDays } from "~/utils/date";
import { Example, Section } from "./_PlaygroundLayout";

const CUSTOM_RANGES: CustomDateRange[] = [
  { label: "1 week", qty: 1, unit: "weeks" },
  { label: "15 days", qty: 15, unit: "days" },
  { label: "1 month", qty: 1, unit: "months" },
  { label: "3 months", qty: 3, unit: "months" },
  { label: "6 months", qty: 6, unit: "months" },
  { label: "1 year", qty: 1, unit: "years" },
];
const TODAY = new Date();
const MIN_DATE = addDays(TODAY, -7);
const MAX_DATE = addDays(TODAY, 30);

export default function FormDateRangePlayground() {
  const [ranges, setRanges] = useState<Record<string, DateRangeValue | null>>({
    basic: null,
    dateTime: { start: "2026-01-15 09:30", end: "2026-01-20 18:00" },
    customRanges: null,
    restricted: null,
    flexField: null,
    disabled: { start: "2026-01-15", end: "2026-01-20" },
    error: null,
    spanish: null,
  });

  const field = (key: string) => ({
    value: ranges[key],
    onChange: (val: DateRangeValue) => setRanges((r) => ({ ...r, [key]: val })),
  });

  return (
    <Section title="FormDateRange" state={ranges}>
      <Example title="Basic (first click sets the start, second the end)">
        <FormDateRange
          label="Period"
          startPlaceholder="From"
          endPlaceholder="To"
          {...field("basic")}
        />
      </Example>
      <Example title="Date time">
        <FormDateRange label="Period" dateTime {...field("dateTime")} />
      </Example>
      <Example title="Custom ranges">
        <FormDateRange
          label="Period"
          customRanges={CUSTOM_RANGES}
          {...field("customRanges")}
        />
      </Example>
      <Example title="Weekends disabled, from 7 days ago up to 30 days ahead">
        <FormDateRange
          label="Period"
          disabledWeekdays={[0, 6]}
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
          {...field("restricted")}
        />
      </Example>
      <Example title="Flex field">
        <FormDateRange label="Period" flexField {...field("flexField")} />
      </Example>
      <Example title="Custom lang (lang={es})">
        <FormDateRange
          label="Period"
          startPlaceholder="From"
          endPlaceholder="To"
          lang={es}
          {...field("spanish")}
        />
      </Example>
      <Example title="Disabled">
        <FormDateRange label="Period" disabled {...field("disabled")} />
      </Example>
      <Example title="With errors">
        <FormDateRange
          label="Period"
          errors={["Required"]}
          {...field("error")}
        />
      </Example>
    </Section>
  );
}
