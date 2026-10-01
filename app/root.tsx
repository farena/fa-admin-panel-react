import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./assets/scss/styles.scss";
import ToastProvider from "./components/Toast/ToastProvider";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.3.1/css/all.min.css",
  },
];

const DEV_ROUTES = [
  { label: "Playground", to: "/" },
  { label: "Login", to: "/login" },
  { label: "Forgot password", to: "/forgot_password" },
  { label: "Reset password", to: "/reset_password/test-token" },
  { label: "Activate user", to: "/activate_user/test-token" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Routes to playground or to dashboard templates */}

        <nav className="nav bg-primary border-bottom py-1">
          <div className="container">
            <div className="d-flex justify-content-between">
              {DEV_ROUTES.map((route) => (
                <NavLink
                  key={route.to}
                  to={route.to}
                  end
                  className={({ isActive }) =>
                    `nav-link text-white${isActive ? " font-weight-bold" : ""}`
                  }
                >
                  {route.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
