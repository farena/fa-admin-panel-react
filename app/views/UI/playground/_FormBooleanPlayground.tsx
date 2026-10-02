import { useState } from "react";
import FormBoolean from "~/components/Form/FormBoolean";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormBooleanPlayground() {
  const [booleans, setBooleans] = useState<{
    basic: boolean | null;
    custom: boolean | null;
    disabled: boolean | null;
  }>({
    basic: null,
    custom: true,
    disabled: false,
  });

  return (
    <Section title="FormBoolean" state={booleans}>
      <Example title="Basic (starts as null)">
        <FormBoolean
          label="Active"
          value={booleans.basic}
          onChange={(basic) => setBooleans({ ...booleans, basic })}
        />
      </Example>
      <Example title="Custom labels">
        <FormBoolean
          label="Visible"
          trueLabel="Shown"
          falseLabel="Hidden"
          value={booleans.custom}
          onChange={(custom) => setBooleans({ ...booleans, custom })}
        />
      </Example>
      <Example title="Disabled">
        <FormBoolean
          label="Disabled"
          disabled
          value={booleans.disabled}
          onChange={(disabled) => setBooleans({ ...booleans, disabled })}
        />
      </Example>
    </Section>
  );
}
