import { useRef, useState } from "react";
import FormButton from "~/components/Form/FormButton";
import FormHtml, { type FormHtmlHandle } from "~/components/Form/FormHtml";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormHtmlPlayground() {
  const [html, setHtml] = useState({
    basic: "<p>Hello <strong>world</strong></p>",
    mentions: "",
  });
  const basicRef = useRef<FormHtmlHandle>(null);

  return (
    <Section title="FormHtml" state={html}>
      <Example title="Basic with focus action">
        <FormHtml
          ref={basicRef}
          label="Description"
          value={html.basic}
          onChange={(basic) => setHtml({ ...html, basic })}
        />
        <FormButton
          small
          className="mt-2"
          onClick={() => basicRef.current?.focus()}
        >
          Focus
        </FormButton>
      </Example>
      <Example title="Mentions (type #), placeholder and Spanish UI">
        <FormHtml
          label="Email template"
          value={html.mentions}
          placeholder="Write something…"
          autocompleteOpts={["#name", "#surname", "#email"]}
          lang="es"
          onChange={(mentions) => setHtml({ ...html, mentions })}
        />
      </Example>
      <Example title="Disabled">
        <FormHtml
          label="Disabled"
          value="<p>Read-only content</p>"
          disabled
          onChange={() => {}}
        />
      </Example>
      <Example title="With errors">
        <FormHtml
          label="Description"
          value=""
          errors={["Required"]}
          onChange={() => {}}
        />
      </Example>
    </Section>
  );
}
