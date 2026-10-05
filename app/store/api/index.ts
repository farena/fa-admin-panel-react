import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { store } from "..";
import { clearSession, selectToken, setCredentials } from "../slices/authSlice";
import { toast } from "~/components/Toast/ToastProvider";
import type { Credentials } from "./auth";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Send the httpOnly refresh token cookie set by the backend
  withCredentials: true,
});

// Endpoints that must not trigger a token refresh when they answer 401
const AUTH_ENDPOINTS = ["login", "logout", "refresh_token"];

// Shared between concurrent 401s so the refresh token is only used once
let refreshing: Promise<boolean> | null = null;

// Asks the backend for a new access token using the refresh token cookie.
// Resolves false (and clears the session) if there is no valid cookie.
export function refreshSession(): Promise<boolean> {
  if (refreshing) return refreshing;

  refreshing = client
    .post("refresh_token")
    .then((data) => {
      store.dispatch(setCredentials(data as unknown as Credentials));
      return true;
    })
    .catch(() => {
      store.dispatch(clearSession());
      return false;
    })
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

// Attach the current session token to every request, unless the caller
// already set its own Authorization header
client.interceptors.request.use((config) => {
  const token = selectToken(store.getState());
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  // The backend wraps every payload in an ApiResponse envelope
  // ({ code, data, message, success }), so unwrap it here once and every
  // request resolves directly with the `data` field.
  (response) => response.data?.data,
  // Error handling. Always rejects with the original error so callers can
  // still react to it after the user has been notified.
  (e: AxiosError<ApiErrorBody>) => {
    const res = e.response?.data;
    const status = e.response?.status ?? res?.code;

    // No response at all: network failure, timeout, CORS...
    if (!e.response) {
      toast.error("Network error, check your connection and try again");
      return Promise.reject(e);
    }

    // Access token expired: refresh it once and retry the original request
    const config = e.config as RetryableConfig | undefined;
    const expired = status === 401 || res?.message === "Token has expired";
    if (
      expired &&
      config &&
      !config._retry &&
      !AUTH_ENDPOINTS.includes(config.url ?? "")
    ) {
      config._retry = true;
      return refreshSession().then((ok) => {
        if (!ok) return Promise.reject(e);
        // Let the request interceptor attach the new token
        delete config.headers.Authorization;
        return client.request(config);
      });
    }

    // Logout if not authorized or the session could not be refreshed
    if ((status && [401, 403].includes(status)) || expired) {
      store.dispatch(clearSession());
      return Promise.reject(e);
    }

    // Show error
    if (res?.message) {
      toast.error(res.message);
      return Promise.reject(e);
    }

    // Show validation errors
    if (res?.errors) {
      Object.values(res.errors).forEach((x) => {
        if (!Array.isArray(x)) return;
        x.forEach((z) => toast.error(z));
      });
      return Promise.reject(e);
    }

    toast.error("Unexpected error, try again in a few minutes");
    console.error(e);

    return Promise.reject(e);
  },
);

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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

type UnwrappedMethods = "request" | "get" | "delete" | "post" | "put" | "patch";

// Same axios instance, retyped to match what the response interceptor
// actually resolves with: `api.post<User>("users", body)` is `Promise<User>`.
// Type-only, there is no runtime wrapper.
export type ApiClient = Omit<AxiosInstance, UnwrappedMethods> & {
  request<T>(config: AxiosRequestConfig): Promise<T>;
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
};

export default client as unknown as ApiClient;
