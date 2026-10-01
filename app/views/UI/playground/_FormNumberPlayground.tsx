import { useState } from "react";
import FormNumber from "~/components/Form/FormNumber";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormNumberPlayground() {
  const [number, setNumber] = useState({
    basic: 10,
    money: 123456,
    arrows: 5,
    disabled: 42,
    error: -1,
  });

  return (
    <Section title="FormNumber" state={number}>
      <Example title="Basic (min 0, max 100, step 5)">
        <FormNumber
          label="Quantity"
          value={number.basic}
          min={0}
          max={100}
          step={5}
          onChange={(basic) => setNumber({ ...number, basic: Number(basic) })}
        />
      </Example>
      <Example title="Money format (value in cents)">
        <FormNumber
          label="Price"
          icon="fa-solid fa-dollar-sign"
          moneyFormat
          value={number.money}
          onChange={(money) => setNumber({ ...number, money: Number(money) })}
        />
      </Example>
      <Example title="Show arrows + select on focus">
        <FormNumber
          label="Units"
          showArrows
          selectOnFocus
          value={number.arrows}
          onChange={(arrows) => setNumber({ ...number, arrows: Number(arrows) })}
        />
      </Example>
      <Example title="Disabled">
        <FormNumber
          label="Disabled"
          disabled
          value={number.disabled}
          onChange={(disabled) =>
            setNumber({ ...number, disabled: Number(disabled) })
          }
        />
      </Example>
      <Example title="With errors">
        <FormNumber
          label="Stock"
          description="(must be positive)"
          value={number.error}
          errors={["Must be greater than 0"]}
          onChange={(error) => setNumber({ ...number, error: Number(error) })}
        />
      </Example>
    </Section>
  );
}
