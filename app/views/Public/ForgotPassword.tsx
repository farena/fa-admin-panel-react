import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import FormText from "~/components/Form/FormText";
import FormButton from "~/components/Form/FormButton";

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: "" });

  const resetPassword = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: dispatch forgotPassword(form) y mostrar toast
    // "Password reset has been sent. Please check your email"
    console.log(form);
  };

  return (
    <form onSubmit={resetPassword}>
      <FormText
        label="Email"
        type="email"
        required
        icon="fa-solid fa-envelope"
        value={form.email}
        onChange={(email) => setForm({ ...form, email })}
      />

      <FormButton type="submit" theme="primary" block>
        Reset Password
      </FormButton>

      <Link className="small text-center d-block mt-2" to="/">
        Back to Login
      </Link>
    </form>
  );
}
