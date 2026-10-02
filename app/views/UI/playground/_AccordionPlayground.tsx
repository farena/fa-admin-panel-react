import { useState } from "react";
import Accordion from "~/components/Accordion/Accordion";
import { Example, Section } from "./_PlaygroundLayout";

export default function AccordionPlayground() {
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  return (
    <Section title="Accordion" state={{ lastEvent }}>
      <Example title="Basic">
        <Accordion
          title="Click to toggle"
          onOpen={() => setLastEvent("onOpen")}
          onClose={() => setLastEvent("onClose")}
        >
          <p className="m-0">Accordion content</p>
        </Accordion>
      </Example>
      <Example title="Open on init">
        <Accordion title="Opened by default" openOnInit>
          <p className="m-0">Accordion content</p>
        </Accordion>
      </Example>
      <Example title="With error">
        <Accordion title="Has error" hasError>
          <p className="m-0">Accordion content</p>
        </Accordion>
      </Example>
    </Section>
  );
}
