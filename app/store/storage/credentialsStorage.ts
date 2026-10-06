import type { Credentials } from "../api/auth";

const CREDENTIALS_KEY = "credentials";

// The access token is kept in localStorage so a page reload can reuse it
// while it's still valid, instead of always spending the refresh token.
// The user is stored with it because the token alone can't restore the
// session. Every access is guarded: localStorage doesn't exist during SSR
// and can throw when site data is blocked.
export function loadCredentials(): Credentials | null {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    return raw ? (JSON.parse(raw) as Credentials) : null;
  } catch {
    return null;
  }
}

export function saveCredentials(credentials: Credentials | null) {
  try {
    if (credentials) {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
    } else {
      localStorage.removeItem(CREDENTIALS_KEY);
    }
  } catch {
    // Not persisted, the session will be restored with the refresh token
  }
}

// Seconds left until the JWT `exp` claim. Tokens that can't be decoded are
// treated as already expired.
export function tokenSecondsLeft(token: string): number {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload)) as { exp?: number };
    return typeof exp === "number" ? exp - Date.now() / 1000 : 0;
  } catch {
    return 0;
  }
}
