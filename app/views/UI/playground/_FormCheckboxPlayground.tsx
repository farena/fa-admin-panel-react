import { useState } from "react";
import FormCheckbox from "~/components/Form/FormCheckbox";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormCheckboxPlayground() {
  const [checkboxes, setCheckboxes] = useState({
    basic: false,
    checked: true,
    disabled: true,
  });

  return (
    <Section title="FormCheckbox" state={checkboxes}>
      <Example title="Default">
        <FormCheckbox
          label="Accept terms and conditions"
          value={checkboxes.basic}
          onChange={(basic) => setCheckboxes({ ...checkboxes, basic })}
        />
      </Example>
      <Example title="Checked by default">
        <FormCheckbox
          label="Subscribe to newsletter"
          value={checkboxes.checked}
          onChange={(checked) => setCheckboxes({ ...checkboxes, checked })}
        />
      </Example>
      <Example title="Disabled">
        <FormCheckbox
          label="Disabled"
          disabled
          value={checkboxes.disabled}
          onChange={(disabled) => setCheckboxes({ ...checkboxes, disabled })}
        />
      </Example>
    </Section>
  );
}
