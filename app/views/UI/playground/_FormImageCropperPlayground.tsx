import { useState } from "react";
import FormImageCropper from "~/components/Form/FormImageCropper";
import FormUploader, {
  type UploadedFile,
} from "~/components/Form/FormUploader";
import { humanReadableSize } from "~/utils/string";
import { Example, Section } from "./_PlaygroundLayout";

const RATIOS = [
  { key: "free", title: "Free crop", ratio: null },
  {
    key: "circle",
    title: "Circle (visual only, the crop is square)",
    ratio: 1,
    circle: true,
  },
  { key: "square", title: "Square (aspectRatio 1)", ratio: 1 },
  { key: "banner", title: "Banner (aspectRatio 16 / 9)", ratio: 16 / 9 },
];

type Result = { description: string; url: string };

export default function FormImageCropperPlayground() {
  const [cropping, setCropping] = useState<{
    key: string;
    ratio: number | null;
    circle?: boolean;
    upload: UploadedFile;
  } | null>(null);
  const [results, setResults] = useState<Record<string, Result>>({});

  const onCropped = (file: File) => {
    if (!cropping) return;
    const { key } = cropping;
    setResults((r) => ({
      ...r,
      [key]: {
        description: `${file.name} (${file.type}, ${humanReadableSize(file.size)})`,
        url: URL.createObjectURL(file),
      },
    }));
  };

  return (
    <Section
      title="FormImageCropper"
      state={Object.fromEntries(
        Object.entries(results).map(([k, v]) => [k, v.description]),
      )}
    >
      {RATIOS.map(({ key, title, ratio, circle }) => (
        <Example key={key} title={title}>
          <FormUploader
            label="Picture"
            imageType
            resetOnSelect
            onChange={(upload) =>
              setCropping({
                key,
                ratio,
                circle,
                upload: Array.isArray(upload) ? upload[0] : upload,
              })
            }
          />
          {results[key] && (
            <img
              src={results[key].url}
              alt="Crop result"
              className="mt-2 border rounded"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          )}
          {results[key] && circle && (
            // How it looks in a round container
            <img
              src={results[key].url}
              alt="Crop result in a circle"
              className="mt-2 ml-2 border"
              style={{ width: 120, height: 120, borderRadius: "50%" }}
            />
          )}
        </Example>
      ))}

      {cropping && (
        <FormImageCropper
          img={cropping.upload.url}
          imgType={cropping.upload.file.type}
          imgName={cropping.upload.file.name}
          aspectRatio={cropping.ratio}
          circle={cropping.circle}
          onCropped={onCropped}
          onClose={() => setCropping(null)}
        />
      )}
    </Section>
  );
}
