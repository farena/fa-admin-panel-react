import { useState } from "react";
import FormSwitch from "~/components/Form/FormSwitch";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormSwitchPlayground() {
  const [switches, setSwitches] = useState({ basic: true, small: false });

  return (
    <Section title="FormSwitch" state={switches}>
      <Example title="Default">
        <FormSwitch
          label="Enable notifications"
          value={switches.basic}
          onChange={(basic) => setSwitches({ ...switches, basic })}
        />
      </Example>
      <Example title="Small">
        <FormSwitch
          label="Remember me"
          small
          value={switches.small}
          onChange={(small) => setSwitches({ ...switches, small })}
        />
      </Example>
    </Section>
  );
}
