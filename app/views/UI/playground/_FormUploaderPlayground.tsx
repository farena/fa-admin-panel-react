import { useState } from "react";
import FormButton from "~/components/Form/FormButton";
import FormUploader, { type UploadedFile } from "~/components/Form/FormUploader";
import { humanReadableSize } from "~/utils/string";
import { Example, Section } from "./_PlaygroundLayout";

// Only what's useful to show (the base64 would flood the state panel)
const describe = (value: UploadedFile | UploadedFile[]) =>
  (Array.isArray(value) ? value : [value]).map(
    ({ file }) => `${file.name} (${file.type}, ${humanReadableSize(file.size)})`,
  );

export default function FormUploaderPlayground() {
  const [uploads, setUploads] = useState<Record<string, string[]>>({});
  const [preview, setPreview] = useState<string | null>(null);

  const onChange = (key: string) => (value: UploadedFile | UploadedFile[]) =>
    setUploads((u) => ({ ...u, [key]: describe(value) }));
  const onReset = (key: string) => () =>
    setUploads((u) => ({ ...u, [key]: [] }));

  return (
    <Section title="FormUploader" state={uploads}>
      <Example title="Basic (images, PDF, video, XLS and CSV up to 2MB)">
        <FormUploader
          label="Attachment"
          description="Any supported file up to 2MB"
          onChange={onChange("basic")}
          onReset={onReset("basic")}
        />
      </Example>
      <Example title="PDF only + asterisk + max 1MB">
        <FormUploader
          label="Invoice"
          asterisk
          pdfType
          maxSizeMB={1}
          buttonText="Upload PDF"
          onChange={onChange("pdf")}
          onReset={onReset("pdf")}
        />
      </Example>
      <Example title="Images resized to 500x500 / 0.5MB (with current slot)">
        <FormUploader
          label="Picture"
          imageType
          maxSizeMB={0.5}
          maxImageWidth={500}
          maxImageHeight={500}
          current={
            preview && (
              <img
                src={preview}
                alt="Preview"
                style={{ height: 80, objectFit: "contain" }}
              />
            )
          }
          onChange={(value) => {
            if (!Array.isArray(value)) setPreview(value.url);
            onChange("image")(value);
          }}
          onReset={() => {
            setPreview(null);
            onReset("image")();
          }}
        />
      </Example>
      <Example title="Multiple + resetOnSelect">
        <FormUploader
          label="Documents"
          multiple
          resetOnSelect
          buttonText="Upload files"
          onChange={onChange("multiple")}
        />
      </Example>
      <Example title="Custom trigger (children render prop)">
        <FormUploader resetOnSelect onChange={onChange("custom")}>
          {({ launchPicker }) => (
            <FormButton outlined icon="fa-solid fa-paperclip" onClick={launchPicker}>
              Attach a file
            </FormButton>
          )}
        </FormUploader>
      </Example>
      <Example title="Disabled">
        <FormUploader label="Disabled" disabled />
      </Example>
      <Example title="With errors">
        <FormUploader
          label="Contract"
          errors={["Required"]}
          onChange={onChange("error")}
        />
      </Example>
    </Section>
  );
}
