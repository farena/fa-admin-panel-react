import { useState } from "react";
import FormColorpicker from "~/components/Form/FormColorpicker";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormColorpickerPlayground() {
  const [colors, setColors] = useState<Record<string, string | null>>({
    basic: "#3b82f6",
    empty: null,
    flexField: "#16a34a",
  });

  return (
    <Section title="FormColorpicker" state={colors}>
      <Example title="Basic">
        <FormColorpicker
          label="Background color"
          value={colors.basic}
          onChange={(basic) => setColors({ ...colors, basic })}
        />
      </Example>
      <Example title="Without color">
        <FormColorpicker
          label="Text color"
          value={colors.empty}
          onChange={(empty) => setColors({ ...colors, empty })}
        />
      </Example>
      <Example title="Flex field">
        <FormColorpicker
          label="Border color"
          flexField
          value={colors.flexField}
          onChange={(flexField) => setColors({ ...colors, flexField })}
        />
      </Example>
      <Example title="Disabled">
        <FormColorpicker
          label="Disabled"
          value="#f97316"
          disabled
          onChange={() => {}}
        />
      </Example>
    </Section>
  );
}
