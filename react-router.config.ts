import type { Config } from "@react-router/dev/config";

// GITHUB_PAGES=true produces a static (SPA) build served under /<repo>/
const isGithubPages = process.env.GITHUB_PAGES === "true";

export default {
  // Server-side render by default; GitHub Pages only serves static files
  ssr: !isGithubPages,
  basename: isGithubPages ? "/fa-admin-panel-react/" : "/",
} satisfies Config;
