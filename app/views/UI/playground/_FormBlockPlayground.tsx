import { useState } from "react";
import FormBlock from "~/components/Form/FormBlock";
import { Example, Section } from "./_PlaygroundLayout";

const COUNTRIES = ["Argentina", "Brazil", "Chile", "Uruguay"];

export default function FormBlockPlayground() {
  const [block, setBlock] = useState({
    basic: "",
    icon: "",
    error: "",
  });

  return (
    <Section title="FormBlock" state={block}>
      <Example title="Basic (wrapping a native select, id links the label)">
        <FormBlock id="block-basic" label="Country">
          <select
            id="block-basic"
            className="w-100"
            value={block.basic}
            onChange={(e) => setBlock({ ...block, basic: e.target.value })}
          >
            <option value="">Select a country...</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </FormBlock>
      </Example>
      <Example title="With icon">
        <FormBlock
          id="block-icon"
          label="Country"
          icon="fa-solid fa-earth-americas"
        >
          <select
            id="block-icon"
            className="w-100"
            value={block.icon}
            onChange={(e) => setBlock({ ...block, icon: e.target.value })}
          >
            <option value="">Select a country...</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </FormBlock>
      </Example>
      <Example title="Read-only content">
        <FormBlock label="Created at" icon="fa-solid fa-calendar">
          <div className="d-flex align-items-center h-100 px-2">
            2026-10-01 12:00
          </div>
        </FormBlock>
      </Example>
      <Example title="Disabled">
        <FormBlock id="block-disabled" label="Disabled" disabled>
          <select id="block-disabled" className="w-100" disabled>
            <option>Argentina</option>
          </select>
        </FormBlock>
      </Example>
      <Example title="With errors">
        <FormBlock id="block-error" label="Country" errors={["Required"]}>
          <select
            id="block-error"
            className="w-100"
            value={block.error}
            onChange={(e) => setBlock({ ...block, error: e.target.value })}
          >
            <option value="">Select a country...</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </FormBlock>
      </Example>
    </Section>
  );
}
