# FA Admin Panel (React)

Admin panel template built with **React 19**, **React Router 8 (framework mode)** and **Vite**, shipping a ready-to-use library of form components, layouts, charts and tables.

**🔗 Live demo:** https://farena.github.io/fa-admin-panel-react/

> The demo opens the **Playground**, a page that showcases every component in the template with its variants and the state it emits. From the top bar you can navigate to the Login, password recovery and the sample Dashboard.

---

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Components](#components)
- [Hooks and utilities](#hooks-and-utilities)
- [Styling and theming](#styling-and-theming)
- [Sidebar menu](#sidebar-menu)
- [Deployment](#deployment)

---

## Features

- ⚛️ React 19 + React Router 8 with SSR (or a static SPA for GitHub Pages)
- 🔒 TypeScript throughout, with generated route types (`react-router typegen`)
- 🧩 20+ controlled form components (text, number, dates, ranges, combobox, uploader, HTML editor, code editor, image cropper, color picker…)
- 📊 Charts powered by [ApexCharts](https://apexcharts.com/) (line, area, bar, pie, donut, radar, radial, heatmap, scatter)
- 📋 Tables powered by [`@farena/fa-tables-react`](https://www.npmjs.com/package/@farena/fa-tables-react)
- 🪟 Modals with [`@farena/fa-modal-react`](https://www.npmjs.com/package/@farena/fa-modal-react) and a WYSIWYG editor with [`@farena/fa-wysiwyg-react`](https://www.npmjs.com/package/@farena/fa-wysiwyg-react)
- 🧭 Public (auth) and dashboard layouts with sidebar and topbar
- 🔔 Global toast notifications
- 🎨 SCSS on top of Bootstrap 4.6.1 (grid + utilities) with a configurable color palette
- 🐳 Production-ready Dockerfile
- 🚀 Automatic deployment to GitHub Pages via GitHub Actions

## Requirements

- Node.js **24** or higher (the version used in CI and in the Dockerfile)
- npm

## Quick start

```bash
git clone git@github.com:farena/fa-admin-panel-react.git my-admin
cd my-admin
npm install
npm run dev
```

The app is available at `http://localhost:5173`.

## Scripts

| Script                | Description                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| `npm run dev`         | Development server with HMR                                              |
| `npm run build`       | Production build with SSR (`build/client` + `build/server`)              |
| `npm run start`       | Serves the SSR build with `react-router-serve`                           |
| `npm run build:pages` | Static (SPA) build with base `/fa-admin-panel-react/` for GitHub Pages   |
| `npm run typecheck`   | Generates route types and runs `tsc`                                     |

## Project structure

```
app/
├── assets/scss/          # Global styles, variables and Bootstrap 4.6.1 (partial)
├── components/           # Reusable components
│   ├── Accordion/
│   ├── Calendar/
│   ├── Charts/
│   ├── Form/
│   ├── ImageCropper/
│   ├── Layout/           # Sidebar and Topbar
│   ├── Pagination/       # SimplePager and InfiniteScroll
│   ├── Tabs/
│   ├── Toast/
│   └── Widget/
├── hooks/                # Shared hooks
├── utils/                # Date, string, debounce and image helpers
├── views/
│   ├── _Layouts/         # PublicLayout and DashboardLayout
│   ├── Auth/             # Protected views (Dashboard)
│   ├── Public/           # Login, password recovery and account activation
│   └── UI/playground/    # Component playground
├── menus.ts              # Sidebar menu definition
├── root.tsx              # HTML document, providers and error boundary
└── routes.ts             # Route configuration
public/                   # Static files (favicon, logo)
```

Imports use the `~/` alias, which points to `app/` (e.g. `import FormText from "~/components/Form/FormText"`).

## Routes

Defined in [`app/routes.ts`](app/routes.ts):

| Route                      | View                               | Layout            |
| -------------------------- | ---------------------------------- | ----------------- |
| `/`                        | Component playground               | —                 |
| `/login`                   | Login                              | `PublicLayout`    |
| `/forgot_password`         | Forgot password                    | `PublicLayout`    |
| `/reset_password/:token`   | Reset password                     | `PublicLayout`    |
| `/activate_user/:token`    | Activate user                      | `PublicLayout`    |
| `/dashboard`               | Finance dashboard (mock data)      | `DashboardLayout` |

To add a new view inside the panel, create the component in `app/views/Auth/` and register it inside `layout("views/_Layouts/DashboardLayout.tsx", [...])`.

> **Authentication:** `DashboardLayout` has a `TODO` where the session check and the redirect to `/login` should be wired. The template does not include a backend or credential handling.

## Components

All form components are **controlled**: they receive `value` and emit the new value through `onChange(value)`. Most of them also accept `label`, `icon` (a Font Awesome class), `disabled` and `errors` (an array of messages).

```tsx
import { useState } from "react";
import FormText from "~/components/Form/FormText";

export default function Example() {
  const [email, setEmail] = useState("");

  return (
    <FormText
      label="Email"
      icon="fa-solid fa-envelope"
      value={email}
      errors={[]}
      onChange={setEmail}
    />
  );
}
```

The most complete reference for props and variants is the Playground ([`app/views/UI/playground/`](app/views/UI/playground/)): there is one `_<Component>Playground.tsx` file per component with real usage examples.

### Form (`app/components/Form`)

| Component           | Purpose                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `FormText`          | Text, password or textarea input, with an optional character limit     |
| `FormNumber`        | Numeric input                                                          |
| `FormSelect`        | Native select                                                          |
| `FormCombobox`      | Searchable select, single or multiple, with options via `optionGetter` |
| `FormDropdown`      | Generic dropdown container (base for combobox and date pickers)        |
| `FormCheckbox`      | Checkbox                                                               |
| `FormSwitch`        | Toggle switch                                                          |
| `FormBoolean`       | Boolean selector with configurable labels (`trueLabel` / `falseLabel`) |
| `FormDate`          | Date picker with calendar                                              |
| `FormDateRange`     | Date range picker                                                      |
| `FormTime`          | Time picker                                                            |
| `FormWeeklyDate`    | Weekday selector (`number[]`, ISO weekdays)                            |
| `FormColorpicker`   | Color picker                                                           |
| `FormIcon`          | Renders a Font Awesome icon (used by the other fields)                 |
| `FormUploader`      | File upload                                                            |
| `FormImageCropper`  | Image upload and cropping                                              |
| `FormHtml`          | WYSIWYG editor (`@farena/fa-wysiwyg-react`)                            |
| `FormCode`          | Code editor (Monaco)                                                   |
| `FormComment`       | Comment box with attachments                                           |
| `FormButton`        | Button (or link via `to`) with icon, tooltip and style variants        |
| `FormLink`          | Styled link                                                            |
| `FormBlock`         | Container to group fields                                              |

### Other components

| Component                          | Location                     | Purpose                                                   |
| ---------------------------------- | ---------------------------- | --------------------------------------------------------- |
| `Sidebar`, `Topbar`                | `components/Layout`          | `DashboardLayout` navigation                              |
| `Widget`, `WidgetCounter`          | `components/Widget`          | Content cards and KPIs (shows a loader while empty)       |
| `Tabs`                             | `components/Tabs`            | Tabs                                                      |
| `Accordion`                        | `components/Accordion`       | Collapsible sections                                      |
| `Calendar`                         | `components/Calendar`        | Calendar (`en` / `es` languages)                          |
| `SimplePager`, `InfiniteScroll`    | `components/Pagination`      | Simple pagination and infinite scroll                     |
| `ToastProvider` / `useToast`       | `components/Toast`           | Global notifications                                      |
| `LineChart`, `AreaChart`, `BarChart`, `PieChart`, `DonutChart`, `RadarChart`, `RadialBarChart`, `HeatmapChart`, `ScatterChart` | `components/Charts` | ApexCharts charts with theme defaults |
| `ImageCropper`                     | `components/ImageCropper`    | Standalone image cropper                                  |

### Toasts

`ToastProvider` already wraps the app in `root.tsx`; from any component:

```tsx
import { useToast } from "~/components/Toast/ToastProvider";

const toast = useToast();
toast.success("Saved successfully");
toast.error("Something went wrong");
// also: toast.warning(...), toast.info(...)
```

## Hooks and utilities

| Module                     | Contents                                                                     |
| -------------------------- | ---------------------------------------------------------------------------- |
| `hooks/useClassParser`     | Turns `{ className: boolean }` into a `className` string                     |
| `hooks/useFocusDropdown`   | Focus handling and open/close for dropdowns                                  |
| `utils/date`               | `parseDate`, `addDays`, `addMonths`, `toYmd`, `toDmy`, `toHm`, …             |
| `utils/string`             | `humanReadableSize`, `formatToMoney`, `centsToDollars`, `textToHtml`, …      |
| `utils/debounce`           | Typed generic debounce                                                       |
| `utils/ImageManager`       | Image loading and processing helpers                                         |

## Styling and theming

- The entry point is [`app/assets/scss/styles.scss`](app/assets/scss/styles.scss), imported in `root.tsx`.
- A subset of **Bootstrap 4.6.1** is included (grid, utilities, typography, forms, tables, badges, alerts).
- The palette is defined in [`_variables.scss`](app/assets/scss/_variables.scss) through `$custom-theme-colors` (`primary`, `secondary`, their `-tint`, `-shade`, `-text` variants and transparencies). Changing those values re-themes the whole panel.
- Icons: **Font Awesome Free** via CDN (see `links` in `root.tsx`). Font: **Inter** from Google Fonts.

## Sidebar menu

The sidebar is generated from [`app/menus.ts`](app/menus.ts):

```ts
export const menus: Menu[] = [
  { icon: "fa-solid fa-gauge-high", title: "Dashboard", to: "/dashboard" },
  {
    icon: "fa-solid fa-chart-pie",
    title: "Reports",
    children: [{ title: "Income" }, { title: "Outcome" }],
  },
];
```

Items without `to` are shown disabled; items with `children` expand as a submenu.

## Deployment

### GitHub Pages (demo)

The [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) workflow publishes the demo on every push to `main` (or manually from the *Actions* tab):

1. Runs `npm run build:pages`, which sets `GITHUB_PAGES=true`. With that variable:
   - `react-router.config.ts` disables SSR (`ssr: false`, SPA mode) and uses `basename: "/fa-admin-panel-react/"`.
   - `vite.config.ts` uses `base: "/fa-admin-panel-react/"`.
2. Copies `index.html` to `404.html` so deep routes (`/dashboard`, `/login`, …) work on reload.
3. Uploads `build/client` as an artifact and deploys it with `actions/deploy-pages`.

**One-time setup:** in the repository, set *Settings → Pages → Build and deployment → Source* to **GitHub Actions**.

If you fork the template under a different repository name, update the `/fa-admin-panel-react/` path in `react-router.config.ts` and `vite.config.ts`.

> To reference files from `public/` inside components, use `import.meta.env.BASE_URL` (e.g. `` `${import.meta.env.BASE_URL}img/logo.svg` ``) so they work both at `/` and under the Pages subpath.

### Docker (SSR)

```bash
docker build -t fa-admin-panel .
docker run -p 3000:3000 fa-admin-panel
```

### Node (SSR)

```bash
npm run build
npm run start
```

Deploy `package.json`, the lockfile and the `build/` folder (`build/client` with the static assets and `build/server` with the server code).
