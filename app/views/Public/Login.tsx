import { useEffect, useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import FormText from "~/components/Form/FormText";
import FormSwitch from "~/components/Form/FormSwitch";
import FormButton from "~/components/Form/FormButton";
import { logIn } from "~/store/api/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  useEffect(() => {
    const defaultEmail = localStorage.getItem("default_email");
    const defaultPw = localStorage.getItem("default_pw");
    setForm((f) => ({
      ...f,
      email: defaultEmail ?? f.email,
      password: defaultPw ?? f.password,
    }));
  }, []);

  const signIn = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    logIn(form);
  };

  return (
    <form onSubmit={signIn}>
      <FormText
        label="Email"
        icon="fa-solid fa-envelope"
        value={form.email}
        onChange={(email) => setForm({ ...form, email })}
      />
      <FormText
        label="Password"
        password
        icon="fa-solid fa-fingerprint"
        value={form.password}
        onChange={(password) => setForm({ ...form, password })}
      />
      <FormSwitch
        label="Remember me"
        small
        value={form.remember}
        onChange={(remember) => setForm({ ...form, remember })}
      />

      <FormButton type="submit" theme="primary" block className="mt-4">
        Log In
      </FormButton>

      <Link className="small text-center d-block mt-2" to="/forgot_password">
        Forgot your password?
      </Link>
    </form>
  );
}
