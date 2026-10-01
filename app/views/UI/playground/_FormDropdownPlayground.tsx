import { useState } from "react";
import FormButton from "~/components/Form/FormButton";
import FormDropdown from "~/components/Form/FormDropdown";
import { Example, Section } from "./_PlaygroundLayout";

const DROPDOWN_POSITIONS = ["top", "bottom", "left", "right"] as const;

const DROPDOWN_ITEMS = [
  { label: "Edit", icon: "fa-solid fa-pen" },
  { label: "Duplicate", icon: "fa-solid fa-copy" },
  { label: "Delete", icon: "fa-solid fa-trash" },
];

function DropdownMenu({
  onSelect,
}: {
  onSelect: (label: string) => void;
}) {
  return (
    <div className="card p-2">
      {DROPDOWN_ITEMS.map((item) => (
        <FormButton
          key={item.label}
          plain
          block
          icon={item.icon}
          className="justify-content-start"
          onClick={() => onSelect(item.label)}
        >
          {item.label}
        </FormButton>
      ))}
    </div>
  );
}

export default function FormDropdownPlayground() {
  const [dropdownSelection, setDropdownSelection] = useState<string | null>(
    null,
  );

  return (
    <Section title="FormDropdown" state={{ selected: dropdownSelection }}>
      <Example title="Default (built-in button)">
        <FormDropdown>
          <DropdownMenu onSelect={setDropdownSelection} />
        </FormDropdown>
      </Example>
      <Example title="Positions (custom action slot + parentEl)">
        <div className="d-flex flex-wrap" style={{ gap: "0.5em" }}>
          {DROPDOWN_POSITIONS.map((position) => (
            <div key={position} id={`dropdown-${position}`}>
              <FormDropdown
                position={position}
                parentEl={`#dropdown-${position}`}
                slots={{
                  action: ({ open }) => (
                    <FormButton outlined onClick={() => open()}>
                      {position}
                    </FormButton>
                  ),
                }}
              >
                <DropdownMenu onSelect={setDropdownSelection} />
              </FormDropdown>
            </div>
          ))}
        </div>
      </Example>
      <Example title="Narrow trigger (dropdown keeps a 250px min width)">
        <div id="dropdown-narrow" className="d-inline-block">
          <FormDropdown
            parentEl="#dropdown-narrow"
            slots={{
              action: ({ open }) => (
                <FormButton
                  justIcon
                  icon="fa-solid fa-ellipsis-vertical"
                  onClick={() => open()}
                />
              ),
            }}
          >
            <DropdownMenu onSelect={setDropdownSelection} />
          </FormDropdown>
        </div>
      </Example>
    </Section>
  );
}
