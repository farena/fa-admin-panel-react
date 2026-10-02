import { useRef, useState } from "react";
import FormButton from "~/components/Form/FormButton";
import FormCode, { type FormCodeHandle } from "~/components/Form/FormCode";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormCodePlayground() {
  const [code, setCode] = useState({
    basic: "<div><p>Hello <strong>world</strong></p></div>",
    json: '{"name":"fa-admin-panel","private":true}',
  });
  const basicRef = useRef<FormCodeHandle>(null);

  return (
    <Section title="FormCode" state={code}>
      <Example title="Basic (HTML) with format action">
        <FormCode
          ref={basicRef}
          label="Template"
          value={code.basic}
          onChange={(basic) => setCode({ ...code, basic })}
        />
        <FormButton
          small
          className="mt-2"
          onClick={() => basicRef.current?.formatCode()}
        >
          Format code
        </FormButton>
      </Example>
      <Example title="JSON language">
        <FormCode
          label="Config"
          language="json"
          value={code.json}
          onChange={(json) => setCode({ ...code, json })}
        />
      </Example>
      <Example title="Disabled (read-only)">
        <FormCode
          label="Disabled"
          value="<p>Read-only content</p>"
          disabled
          onChange={() => {}}
        />
      </Example>
      <Example title="With errors">
        <FormCode
          label="Template"
          value=""
          errors={["Required"]}
          onChange={() => {}}
        />
      </Example>
    </Section>
  );
}
