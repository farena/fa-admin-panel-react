import apiClient from ".";
import { store } from "..";
import { clearSession, setCredentials } from "../slices/authSlice";

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
}

export interface Credentials {
  user: User;
  token: string;
}

export function logIn(form: { email: string; password: string }) {
  // Mock authentication for demo purposes
  if (import.meta.env.VITE_MOCK_AUTH) {
    store.dispatch(
      setCredentials({
        user: {
          user_id: 1,
          name: "admin",
          email: "admin@test.com",
          role: "admin",
        },
        token: "jwt_token_123",
      }),
    );
    return;
  }

  apiClient.post<Credentials>("login", form).then((data) => {
    store.dispatch(setCredentials(data));
  });
}

export function logOut() {
  store.dispatch(clearSession());
}

export function refreshToken(token: string) {
  apiClient.post<Credentials>("refresh_token", { token }).then((data) => {
    store.dispatch(setCredentials(data));
  });
}
