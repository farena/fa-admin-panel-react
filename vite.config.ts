import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 4.6.1 usa sintaxis Sass legacy; silenciamos sus deprecations
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
