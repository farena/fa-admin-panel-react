import { useState } from "react";
import FormTime from "~/components/Form/FormTime";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormTimePlayground() {
  const [time, setTime] = useState<{
    empty: string | null;
    preset: string | null;
    invalid: string | null;
    disabled: string | null;
  }>({
    empty: null,
    preset: "09:30",
    invalid: "25:99",
    disabled: "18:00",
  });

  return (
    <Section title="FormTime" state={time}>
      <Example title="Empty value (fills with the current time)">
        <FormTime
          value={time.empty}
          onChange={(empty) => setTime((t) => ({ ...t, empty }))}
        />
      </Example>
      <Example title="Preset value (values are clamped on blur)">
        <FormTime
          value={time.preset}
          onChange={(preset) => setTime((t) => ({ ...t, preset }))}
        />
      </Example>
      <Example title='Invalid value ("25:99" falls back to now)'>
        <FormTime
          value={time.invalid}
          onChange={(invalid) => setTime((t) => ({ ...t, invalid }))}
        />
      </Example>
      <Example title="Disabled">
        <FormTime
          disabled
          value={time.disabled}
          onChange={(disabled) => setTime((t) => ({ ...t, disabled }))}
        />
      </Example>
    </Section>
  );
}
