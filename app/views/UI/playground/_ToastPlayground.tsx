import FormButton from "~/components/Form/FormButton";
import { useToast } from "~/components/Toast/ToastProvider";
import { Example, Section } from "./_PlaygroundLayout";

export default function ToastPlayground() {
  const toast = useToast();

  return (
    <Section title="Toast">
      <Example title="useToast() (click a toast to dismiss it)">
        <div className="d-flex flex-wrap" style={{ gap: "0.5em" }}>
          <FormButton theme="success" onClick={() => toast.success("Saved")}>
            success
          </FormButton>
          <FormButton
            theme="danger"
            onClick={() => toast.error("Something went wrong")}
          >
            error
          </FormButton>
          <FormButton
            theme="warning"
            onClick={() => toast.warning("Check the form")}
          >
            warning
          </FormButton>
          <FormButton theme="info" onClick={() => toast.info("New version")}>
            info
          </FormButton>
        </div>
      </Example>
    </Section>
  );
}
