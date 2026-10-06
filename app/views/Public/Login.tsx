import { useEffect, useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import FormText from "~/components/Form/FormText";
import FormSwitch from "~/components/Form/FormSwitch";
import FormButton from "~/components/Form/FormButton";
import { useLoginMutation } from "~/store/api/auth";

const REMEMBERED_EMAIL_KEY = "remembered_email";

export default function Login() {
  const [logIn, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  useEffect(() => {
    // Only the email is remembered, the password is left to the browser's
    // password manager
    const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (rememberedEmail) setForm((f) => ({ ...f, email: rememberedEmail }));
  }, []);

  const signIn = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    logIn(form)
      .unwrap()
      .then(() => {
        // Only remember emails that were able to log in
        if (form.remember) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, form.email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      })
      // Errors are already notified by the base query
      .catch(() => {});
  };

  return (
    <form onSubmit={signIn}>
      <FormText
        label="Email"
        icon="fa-solid fa-envelope"
        name="email"
        autoComplete="username"
        value={form.email}
        onChange={(email) => setForm({ ...form, email })}
      />
      <FormText
        label="Password"
        password
        icon="fa-solid fa-fingerprint"
        name="password"
        autoComplete="current-password"
        value={form.password}
        onChange={(password) => setForm({ ...form, password })}
      />
      <FormSwitch
        label="Remember me"
        small
        value={form.remember}
        onChange={(remember) => setForm({ ...form, remember })}
      />

      <FormButton
        type="submit"
        theme="primary"
        block
        className="mt-4"
        disabled={isLoading}
      >
        Log In
      </FormButton>

      <Link className="small text-center d-block mt-2" to="/forgot_password">
        Forgot your password?
      </Link>
    </form>
  );
}
