import { useCallback, useState, type ComponentProps } from "react";
import FormCombobox from "~/components/Form/FormCombobox";
import { Example, Section } from "./_PlaygroundLayout";

type ComboOption = { label: string; value: string | object };

const FRUITS: ComboOption[] = [
  "Apple",
  "Banana",
  "Cherry",
  "Grape",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Pineapple",
  "Strawberry",
  "Watermelon",
].map((fruit) => ({ label: fruit, value: fruit.toLowerCase() }));

// Wraps FormCombobox with a fake API that filters FRUITS after a short delay
function ComboboxExample(
  props: Omit<
    ComponentProps<typeof FormCombobox>,
    "options" | "optionGetter" | "onFocus"
  >,
) {
  const { newOption } = props;
  const [options, setOptions] = useState<ComboOption[]>([]);

  const optionGetter = useCallback(
    (search: string | null) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          const term = search?.toLowerCase() ?? "";
          const found = FRUITS.filter((fruit) =>
            fruit.label.toLowerCase().includes(term),
          );

          if (
            newOption &&
            search &&
            !found.some((fruit) => fruit.label.toLowerCase() === term)
          ) {
            found.push({ label: `${newOption}${search}`, value: "new" });
          }

          setOptions(found);
          resolve();
        }, 300);
      }),
    [newOption],
  );

  return (
    <FormCombobox
      {...props}
      options={options}
      optionGetter={optionGetter}
      onFocus={() => {}}
    />
  );
}

export default function FormComboboxPlayground() {
  const [combobox, setCombobox] = useState<{
    single: ComboOption | null;
    icon: ComboOption | null;
    multiple: ComboOption[];
    newOption: ComboOption[];
    disabled: ComboOption | null;
  }>({
    single: null,
    icon: null,
    multiple: [FRUITS[0]],
    newOption: [],
    disabled: null,
  });

  return (
    <Section title="FormCombobox" state={combobox}>
      <Example title="Single (arrows + enter to select)">
        <ComboboxExample
          label="Fruit"
          placeholder="Search a fruit..."
          noDataMsg="No fruits found"
          value={combobox.single}
          onChange={(single) =>
            setCombobox({ ...combobox, single: single as ComboOption })
          }
        />
      </Example>
      <Example title="With icon + min length (2)">
        <ComboboxExample
          label="Fruit"
          icon="fa-solid fa-magnifying-glass"
          minLen={2}
          noDataMsg="No fruits found"
          value={combobox.icon}
          onChange={(icon) =>
            setCombobox({ ...combobox, icon: icon as ComboOption })
          }
        />
      </Example>
      <Example title="Multiple">
        <ComboboxExample
          label="Fruits"
          multiple
          noDataMsg="No fruits found"
          value={combobox.multiple}
          onChange={(multiple) =>
            setCombobox({ ...combobox, multiple: multiple as ComboOption[] })
          }
        />
      </Example>
      <Example title='Multiple + new option ("Create: ")'>
        <ComboboxExample
          label="Tags"
          multiple
          newOption="Create: "
          noDataMsg="No fruits found"
          value={combobox.newOption}
          onChange={(newOption) =>
            setCombobox({
              ...combobox,
              newOption: newOption as ComboOption[],
            })
          }
        />
      </Example>
      <Example title="Disabled">
        <ComboboxExample
          label="Disabled"
          disabled
          value={combobox.disabled}
          onChange={(disabled) =>
            setCombobox({ ...combobox, disabled: disabled as ComboOption })
          }
        />
      </Example>
    </Section>
  );
}
