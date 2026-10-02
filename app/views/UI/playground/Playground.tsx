import FormTextPlayground from "./_FormTextPlayground";
import FormNumberPlayground from "./_FormNumberPlayground";
import FormSwitchPlayground from "./_FormSwitchPlayground";
import FormCheckboxPlayground from "./_FormCheckboxPlayground";
import FormBlockPlayground from "./_FormBlockPlayground";
import FormDropdownPlayground from "./_FormDropdownPlayground";
import FormComboboxPlayground from "./_FormComboboxPlayground";
import CalendarPlayground from "./_CalendarPlayground";
import FormButtonPlayground from "./_FormButtonPlayground";
import FormSelectPlayground from "./_FormSelectPlayground";
import FormBooleanPlayground from "./_FormBooleanPlayground";
import FormLinkPlayground from "./_FormLinkPlayground";
import FormTimePlayground from "./_FormTimePlayground";
import FormWeeklyDatePlayground from "./_FormWeeklyDatePlayground";
import FormDatePlayground from "./_FormDatePlayground";
import FormDateRangePlayground from "./_FormDateRangePlayground";
import ToastPlayground from "./_ToastPlayground";
import FormUploaderPlayground from "./_FormUploaderPlayground";
import FormCommentPlayground from "./_FormCommentPlayground";
import FormCodePlayground from "./_FormCodePlayground";
import FormColorpickerPlayground from "./_FormColorpickerPlayground";

export default function Playground() {
  return (
    <div className="container py-4">
      <h2 className="mb-1">UI Playground</h2>
      <p className="text-muted mb-4">
        Sandbox to test the <code>components/Form</code> components.
      </p>

      <FormTextPlayground />
      <FormNumberPlayground />
      <FormSwitchPlayground />
      <FormCheckboxPlayground />
      <FormBlockPlayground />
      <FormDropdownPlayground />
      <FormComboboxPlayground />
      <CalendarPlayground />
      <FormButtonPlayground />
      <FormSelectPlayground />
      <FormBooleanPlayground />
      <FormLinkPlayground />
      <FormTimePlayground />
      <FormWeeklyDatePlayground />
      <FormDatePlayground />
      <FormDateRangePlayground />
      <ToastPlayground />
      <FormUploaderPlayground />
      <FormCommentPlayground />
      <FormCodePlayground />
      <FormColorpickerPlayground />
    </div>
  );
}
