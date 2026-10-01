import { useState } from "react";
import FormSelect, { type SelectOption } from "~/components/Form/FormSelect";
import { Example, Section } from "./_PlaygroundLayout";

const COLORS = [
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Blue", value: "blue" },
  { label: "Yellow", value: "yellow" },
  { label: "Purple", value: "purple" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

const USERS = [
  { user_id: 1, full_name: "Ada Lovelace" },
  { user_id: 2, full_name: "Alan Turing" },
  { user_id: 3, full_name: "Grace Hopper" },
];

export default function FormSelectPlayground() {
  const [select, setSelect] = useState<{
    basic: unknown;
    primitive: unknown;
    customKeys: unknown;
    error: unknown;
    disabled: unknown;
    multiple: SelectOption[];
  }>({
    basic: null,
    primitive: "M",
    customKeys: null,
    error: null,
    disabled: "green",
    multiple: [COLORS[0]],
  });
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  return (
    <Section title="FormSelect" state={{ ...select, lastEvent }}>
      <Example title="Basic (onSelect returns the whole option)">
        <FormSelect
          label="Color"
          options={COLORS}
          value={select.basic}
          onChange={(basic) => setSelect({ ...select, basic })}
          onSelect={(opt) => setLastEvent(`onSelect: ${JSON.stringify(opt)}`)}
        />
      </Example>
      <Example title="Primitive options + icon">
        <FormSelect
          label="Size"
          icon="fa-solid fa-shirt"
          options={SIZES}
          value={select.primitive}
          onChange={(primitive) => setSelect({ ...select, primitive })}
        />
      </Example>
      <Example title="Custom optionLabel / optionValue">
        <FormSelect
          label="User"
          options={USERS}
          optionLabel="full_name"
          optionValue="user_id"
          value={select.customKeys}
          onChange={(customKeys) => setSelect({ ...select, customKeys })}
        />
      </Example>
      <Example title="Asterisk + errors">
        <FormSelect
          label="Color"
          asterisk
          options={COLORS}
          errors={["Required"]}
          value={select.error}
          onChange={(error) => setSelect({ ...select, error })}
        />
      </Example>
      <Example title="Disabled">
        <FormSelect
          label="Disabled"
          disabled
          options={COLORS}
          value={select.disabled}
          onChange={(disabled) => setSelect({ ...select, disabled })}
        />
      </Example>
      <Example title="Multiple (arrows + enter to select)">
        <FormSelect
          label="Colors"
          multiple
          icon="fa-solid fa-palette"
          options={COLORS}
          value={select.multiple}
          onChange={(multiple) =>
            setSelect({ ...select, multiple: multiple as SelectOption[] })
          }
          onRemove={(opt) => setLastEvent(`onRemove: ${JSON.stringify(opt)}`)}
        />
      </Example>
    </Section>
  );
}
