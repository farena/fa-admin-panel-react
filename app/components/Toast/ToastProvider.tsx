import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./_toast.scss";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastApi = Record<ToastType, (message: string) => void>;

const ICONS: Record<ToastType, string> = {
  success: "fa-solid fa-circle-check",
  error: "fa-solid fa-circle-exclamation",
  warning: "fa-solid fa-triangle-exclamation",
  info: "fa-solid fa-circle-info",
};

const TOAST_DURATION = 5000;

const ToastContext = createContext<ToastApi | null>(null);

// Imperative access for non-React code (RTK Query base query, etc.)
let toastRef: ToastApi | null = null;

export const toast: ToastApi = {
  success: (m) => toastRef?.success(m),
  error: (m) => toastRef?.error(m),
  warning: (m) => toastRef?.warning(m),
  info: (m) => toastRef?.info(m),
};

export function useToast(): ToastApi {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside a ToastProvider");

  return toast;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastId = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, message: string) => {
      const id = ++lastId.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), TOAST_DURATION);
    },
    [remove],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => show("success", message),
      error: (message) => show("error", message),
      warning: (message) => show("warning", message),
      info: (message) => show("info", message),
    }),
    [show],
  );

  useEffect(() => {
    toastRef = api;
    return () => {
      toastRef = null;
    };
  }, [api]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-item toast-${t.type}`}
            onClick={() => remove(t.id)}
          >
            <i className={ICONS[t.type]} />
            <span className="toast-message">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
