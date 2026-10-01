import { useState } from "react";
import FormComment, {
  type CommentAttachment,
  type CommentForm,
} from "~/components/Form/FormComment";
import { Example, Section } from "./_PlaygroundLayout";

const USER = { first_name: "Ada", last_name: "Lovelace" };

const EXISTING_COMMENT: CommentForm = {
  description: "Existing comment, already saved in the backend",
  attachments: [{ name: "contract.pdf", size: 254_000 }],
};

const attachmentName = (a: CommentAttachment) =>
  "file" in a ? a.file.name : a.name;

// Only what's useful to show (the base64 would flood the state panel)
const describe = (form: CommentForm) => ({
  description: form.description,
  attachments: form.attachments.map(attachmentName),
});

export default function FormCommentPlayground() {
  const [saved, setSaved] = useState<ReturnType<typeof describe>[]>([]);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  return (
    <Section title="FormComment" state={{ saved, lastEvent }}>
      <Example title="New comment (click the input to open it)">
        <FormComment
          user={USER}
          onSave={(form) => setSaved((s) => [...s, describe(form)])}
        />
      </Example>
      <Example title="Editing (startOpen + async attachment actions)">
        <FormComment
          user={USER}
          value={EXISTING_COMMENT}
          startOpen
          onSave={(form) => setSaved((s) => [...s, describe(form)])}
          onCancel={() => setLastEvent("onCancel")}
          onAddAttachment={async (a) => {
            // Fake request
            await new Promise((resolve) => setTimeout(resolve, 300));
            setLastEvent(`onAddAttachment: ${a.file.name}`);
          }}
          onRemoveAttachment={(a) =>
            setLastEvent(`onRemoveAttachment: ${attachmentName(a)}`)
          }
        />
      </Example>
      <Example title="Without user">
        <FormComment
          placeholder="Leave a note..."
          onSave={(form) => setSaved((s) => [...s, describe(form)])}
        />
      </Example>
    </Section>
  );
}
