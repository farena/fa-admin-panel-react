import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { store } from "..";
import { clearSession, selectToken } from "../slices/authSlice";
import { toast } from "~/components/Toast/ToastProvider";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

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

    // Logout if not authorized or the session expired
    if (
      (status && [401, 403].includes(status)) ||
      res?.message === "Token has expired"
    ) {
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
