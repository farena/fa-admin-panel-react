import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const isGithubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGithubPages ? "/fa-admin-panel-react/" : "/",
  plugins: [reactRouter()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 4.6.1 uses legacy Sass syntax; silence its deprecations
        silenceDeprecations: [
          "import",
          "global-builtin",
          "color-functions",
          "if-function",
          "abs-percent",
          "slash-div",
        ],
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
