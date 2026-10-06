import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { clearSession, setCredentials } from "../slices/authSlice";
import { toast } from "~/components/Toast/ToastProvider";
import type { Credentials } from "./auth";
import {
  loadCredentials,
  tokenSecondsLeft,
} from "../storage/credentialsStorage";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  // Send the httpOnly refresh token cookie set by the backend
  credentials: "include",
  // Attach the current session token to every request, unless the caller
  // already set its own Authorization header
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// The backend wraps every payload in an ApiResponse envelope
// ({ code, data, message, success }), so strip it here once and every
// endpoint receives directly the `data` field.
const envelopeBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.data !== undefined) {
    return { ...result, data: (result.data as ApiResponse | null)?.data };
  }
  return result;
};

// Endpoints that must not trigger a token refresh when they answer 401
const AUTH_ENDPOINTS = ["login", "logout", "refresh_token"];

// Shared between concurrent 401s so the refresh token is only used once
let refreshing: Promise<boolean> | null = null;

// A stored access token is only reused if it lives at least this long
const MIN_TOKEN_SECONDS_LEFT = 10;

// Reuses the access token stored in localStorage while it still has time
// left, otherwise asks the backend for a new one using the refresh token
// cookie. Resolves false (and clears the session) if there is no valid cookie.
export function refreshSession(api: BaseQueryApi): Promise<boolean> {
  if (refreshing) return refreshing;

  // The stored token is skipped if it's the one in use, since the backend
  // has just rejected it (e.g. the client clock is behind the server one)
  const stored = loadCredentials();
  const current = (api.getState() as RootState).auth.token;

  if (
    stored &&
    stored.token !== current &&
    tokenSecondsLeft(stored.token) >= MIN_TOKEN_SECONDS_LEFT
  ) {
    api.dispatch(setCredentials(stored));
    return Promise.resolve(true);
  }

  refreshing = Promise.resolve(
    envelopeBaseQuery({ url: "refresh_token", method: "POST" }, api, {}),
  )
    .then((result) => {
      if (result.error) {
        api.dispatch(clearSession());
        return false;
      }
      api.dispatch(setCredentials(result.data as Credentials));
      return true;
    })
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await envelopeBaseQuery(args, api, extraOptions);
  if (!result.error) return result;

  const url = typeof args === "string" ? args : args.url;
  let res = result.error.data as ApiErrorBody | undefined;
  let status = httpStatus(result.error) ?? res?.code;
  let expired = status === 401 || res?.message === "Token has expired";

  // Access token expired: refresh it once and retry the original request.
  // The retry picks the new token up from the store in prepareHeaders.
  if (expired && !AUTH_ENDPOINTS.includes(url)) {
    if (!(await refreshSession(api))) return result;

    result = await envelopeBaseQuery(args, api, extraOptions);
    if (!result.error) return result;

    res = result.error.data as ApiErrorBody | undefined;
    status = httpStatus(result.error) ?? res?.code;
    expired = status === 401 || res?.message === "Token has expired";
  }

  notifyError(result.error, res, status, expired, api);
  return result;
};

// Error handling. The error is still returned to the caller so it can react
// to it after the user has been notified.
function notifyError(
  error: FetchBaseQueryError,
  res: ApiErrorBody | undefined,
  status: number | undefined,
  expired: boolean,
  api: BaseQueryApi,
) {
  // No response at all: network failure, timeout, CORS...
  if (error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR") {
    toast.error("Network error, check your connection and try again");
    return;
  }

  // Logout if not authorized or the session could not be refreshed
  if ((status && [401, 403].includes(status)) || expired) {
    api.dispatch(clearSession());

    if (!AUTH_ENDPOINTS.includes(api.endpoint)) return;
  }

  // Show error
  if (res?.message) {
    toast.error(res.message);
    return;
  }

  // Show validation errors
  if (res?.errors) {
    Object.values(res.errors).forEach((x) => {
      if (!Array.isArray(x)) return;
      x.forEach((z) => toast.error(z));
    });
    return;
  }

  toast.error("Unexpected error, try again in a few minutes");
  console.error(error);
}

// fetchBaseQuery uses string statuses for non-HTTP failures, but keeps the
// real HTTP status in `originalStatus` when the body could not be parsed
function httpStatus(error: FetchBaseQueryError): number | undefined {
  if (typeof error.status === "number") return error.status;
  if (error.status === "PARSING_ERROR") return error.originalStatus;
  return undefined;
}

// Every feature adds its own endpoints with `api.injectEndpoints()`, so
// they all share this cache, middleware and error handling
export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [],
  endpoints: () => ({}),
});

interface ApiErrorBody {
  code?: number;
  message?: string;
  errors?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}
