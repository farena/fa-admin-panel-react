import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import FormText from "~/components/Form/FormText";
import FormButton from "~/components/Form/FormButton";
import type { Route } from "./+types/ActivateUser";

export default function ActivateUser({ params }: Route.ComponentProps) {
  const [form, setForm] = useState({
    token: params.token,
    password: "",
    password_confirmation: "",
  });

  const createPassword = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: dispatch verifyUser(form), toast "User verified. You can now sign in"
    // and navigate to /
    console.log(form);
  };

  return (
    <form onSubmit={createPassword}>
      <FormText
        label="Password"
        password
        icon="fa-solid fa-fingerprint"
        value={form.password}
        onChange={(password) => setForm({ ...form, password })}
      />
      <FormText
        label="Password Confirmation"
        password
        icon="fa-solid fa-fingerprint"
        value={form.password_confirmation}
        onChange={(password_confirmation) => setForm({ ...form, password_confirmation })}
      />

      <FormButton type="submit" theme="primary" block>
        Create Password
      </FormButton>

      <Link className="small text-center d-block mt-2" to="/">
        Back to Login
      </Link>
    </form>
  );
}
