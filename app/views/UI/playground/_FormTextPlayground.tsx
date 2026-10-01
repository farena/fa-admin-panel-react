import { useState } from "react";
import FormText from "~/components/Form/FormText";
import { Example, Section } from "./_PlaygroundLayout";

export default function FormTextPlayground() {
  const [text, setText] = useState({
    basic: "",
    icon: "",
    password: "",
    disabled: "Disabled value",
    error: "invalid@",
    maxChars: "",
    textarea: "",
  });

  return (
    <Section title="FormText" state={text}>
      <Example title="Basic">
        <FormText
          label="Name"
          placeholder="Type something..."
          value={text.basic}
          errors={[]}
          onChange={(basic) => setText({ ...text, basic })}
        />
      </Example>
      <Example title="With icon">
        <FormText
          label="Email"
          icon="fa-solid fa-envelope"
          value={text.icon}
          errors={[]}
          onChange={(icon) => setText({ ...text, icon })}
        />
      </Example>
      <Example title="Password">
        <FormText
          label="Password"
          password
          icon="fa-solid fa-fingerprint"
          value={text.password}
          errors={[]}
          onChange={(password) => setText({ ...text, password })}
        />
      </Example>
      <Example title="Disabled">
        <FormText
          label="Disabled"
          disabled
          value={text.disabled}
          errors={[]}
          onChange={(disabled) => setText({ ...text, disabled })}
        />
      </Example>
      <Example title="With errors">
        <FormText
          label="Email"
          icon="fa-solid fa-envelope"
          value={text.error}
          errors={["Invalid email", "Required"]}
          onChange={(error) => setText({ ...text, error })}
        />
      </Example>
      <Example title="Max chars (20)">
        <FormText
          label="Short text"
          maxChars={20}
          value={text.maxChars}
          errors={[]}
          onChange={(maxChars) => setText({ ...text, maxChars })}
        />
      </Example>
      <Example title="Textarea">
        <FormText
          label="Description"
          textarea
          textareaRows={3}
          value={text.textarea}
          errors={[]}
          onChange={(textarea) => setText({ ...text, textarea })}
        />
      </Example>
    </Section>
  );
}
