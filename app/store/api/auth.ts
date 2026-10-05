import apiClient, { refreshSession } from ".";
import { store } from "..";
import {
  clearSession,
  markSessionChecked,
  setCredentials,
} from "../slices/authSlice";

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

export interface LoginForm {
  email: string;
  password: string;
  // The backend uses it to decide if the refresh token cookie is persistent
  // (e.g. 30 days) or a session cookie removed when the browser closes
  remember: boolean;
}

export function logIn(form: LoginForm): Promise<void> {
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
    return Promise.resolve();
  }

  return apiClient.post<Credentials>("login", form).then((data) => {
    store.dispatch(setCredentials(data));
  });
}

export function logOut() {
  if (import.meta.env.VITE_MOCK_AUTH) {
    store.dispatch(clearSession());
    return;
  }

  // The refresh token cookie is httpOnly, only the backend can remove it
  apiClient
    .post("logout")
    .catch(() => {})
    .finally(() => {
      store.dispatch(clearSession());
    });
}

// Called once on app start: restores the session from the refresh token
// cookie, if the user logged in before with "Remember me"
export function restoreSession() {
  if (import.meta.env.VITE_MOCK_AUTH) {
    store.dispatch(markSessionChecked());
    return;
  }

  refreshSession().finally(() => {
    store.dispatch(markSessionChecked());
  });
}
