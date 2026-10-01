import FormSelect from "./FormSelect";

type FormBooleanProps = {
  value: boolean | null;
  label?: string;
  trueLabel?: string;
  falseLabel?: string;
  disabled?: boolean;
  errors?: string[];
  onChange: (value: boolean | null) => void;
};

export default function FormBoolean({
  value,
  label,
  trueLabel = "Yes",
  falseLabel = "No",
  disabled = false,
  errors,
  onChange,
}: FormBooleanProps) {
  const options = [
    { value: true, label: trueLabel },
    { value: false, label: falseLabel },
  ];

  return (
    <FormSelect
      label={label}
      options={options}
      value={value}
      disabled={disabled}
      errors={errors}
      onChange={(val) => onChange(val as boolean | null)}
    />
  );
}
