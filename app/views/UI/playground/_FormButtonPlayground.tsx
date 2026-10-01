import { useState } from "react";
import FormButton from "~/components/Form/FormButton";
import { Example, Section } from "./_PlaygroundLayout";

const BUTTON_THEMES = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "light",
  "medium",
  "dark",
];

export default function FormButtonPlayground() {
  const [clicks, setClicks] = useState(0);

  return (
    <Section title="FormButton" state={{ clicks }}>
      <Example title="Themes">
        <div className="d-flex flex-wrap" style={{ gap: "0.5em" }}>
          {BUTTON_THEMES.map((theme) => (
            <FormButton
              key={theme}
              theme={theme}
              onClick={() => setClicks((c) => c + 1)}
            >
              {theme}
            </FormButton>
          ))}
        </div>
      </Example>
      <Example title="Outlined">
        <div className="d-flex flex-wrap" style={{ gap: "0.5em" }}>
          {BUTTON_THEMES.map((theme) => (
            <FormButton
              key={theme}
              theme={theme}
              outlined
              onClick={() => setClicks((c) => c + 1)}
            >
              {theme}
            </FormButton>
          ))}
        </div>
      </Example>
      <Example title="Small">
        <div className="d-flex flex-wrap" style={{ gap: "0.5em" }}>
          <FormButton small onClick={() => setClicks((c) => c + 1)}>
            Small
          </FormButton>
          <FormButton small outlined onClick={() => setClicks((c) => c + 1)}>
            Small outlined
          </FormButton>
        </div>
      </Example>
      <Example title="With icon (icon prop)">
        <div className="d-flex flex-wrap" style={{ gap: "0.5em" }}>
          <FormButton
            icon="fa-solid fa-floppy-disk"
            onClick={() => setClicks((c) => c + 1)}
          >
            Save
          </FormButton>
          <FormButton
            icon="fa-solid fa-trash"
            theme="danger"
            outlined
            onClick={() => setClicks((c) => c + 1)}
          >
            Delete
          </FormButton>
        </div>
      </Example>
      <Example title="Just icon">
        <div className="d-flex flex-wrap" style={{ gap: "0.5em" }}>
          <FormButton
            justIcon
            icon="fa-solid fa-pen"
            onClick={() => setClicks((c) => c + 1)}
          />
          <FormButton
            justIcon
            small
            theme="danger"
            icon="fa-solid fa-trash"
            onClick={() => setClicks((c) => c + 1)}
          />
          <FormButton
            justIcon
            outlined
            theme="success"
            icon="fa-solid fa-check"
            onClick={() => setClicks((c) => c + 1)}
          />
        </div>
      </Example>
      <Example title="Plain">
        <FormButton
          plain
          icon="fa-solid fa-gear"
          onClick={() => setClicks((c) => c + 1)}
        >
          Plain button
        </FormButton>
      </Example>
      <Example title="Tooltip (position adapts to the container edges)">
        <div className="d-flex justify-content-between">
          <FormButton
            justIcon
            icon="fa-solid fa-arrow-left"
            tooltip="Near the left edge"
            tooltipContainer=".container"
            onClick={() => setClicks((c) => c + 1)}
          />
          <FormButton
            icon="fa-solid fa-circle-info"
            tooltip="Default position"
            tooltipContainer=".container"
            onClick={() => setClicks((c) => c + 1)}
          >
            Hover me
          </FormButton>
          <FormButton
            justIcon
            icon="fa-solid fa-arrow-right"
            tooltip="Near the right edge"
            tooltipContainer=".container"
            onClick={() => setClicks((c) => c + 1)}
          />
        </div>
      </Example>
      <Example title="Links (to)">
        <div className="d-flex flex-wrap" style={{ gap: "0.5em" }}>
          <FormButton to="/forgot_password" icon="fa-solid fa-link">
            Internal link
          </FormButton>
          <FormButton
            to="https://reactrouter.com"
            theme="info"
            outlined
            icon="fa-solid fa-arrow-up-right-from-square"
          >
            External link
          </FormButton>
        </div>
      </Example>
      <Example title="Disabled">
        <div className="d-flex flex-wrap" style={{ gap: "0.5em" }}>
          <FormButton disabled>Disabled</FormButton>
          <FormButton disabled outlined>
            Disabled outlined
          </FormButton>
        </div>
      </Example>
      <Example title="Block">
        <FormButton block onClick={() => setClicks((c) => c + 1)}>
          Block button
        </FormButton>
      </Example>
    </Section>
  );
}
