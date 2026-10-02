import type { ApexOptions } from "apexcharts";

// Mirrors the theme colors in assets/scss/_variables.scss
export const CHART_COLORS = [
  "#ff9928", // primary
  "#813dff", // secondary
  "#6abb45", // success
  "#7ad7e4", // info
  "#e14319", // danger
  "#ffba3b", // warning
  "#646464", // dark
];

export const BASE_OPTIONS: ApexOptions = {
  chart: {
    fontFamily: "Lexend, sans-serif",
    foreColor: "#646464",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: CHART_COLORS,
  dataLabels: { enabled: false },
  legend: { position: "top" },
  grid: { borderColor: "#f3f3f3", strokeDashArray: 4 },
  tooltip: { theme: "light" },
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Deep merges plain objects; arrays and primitives from later sources replace earlier ones.
// Undefined values are dropped, so ApexCharts keeps its own defaults (e.g. label formatters)
export function mergeOptions(...sources: (ApexOptions | undefined)[]) {
  const merge = (target: Record<string, unknown>, source: object) => {
    const result = { ...target };
    Object.entries(source).forEach(([key, value]) => {
      if (value === undefined) return;
      result[key] =
        isPlainObject(value) && isPlainObject(result[key])
          ? merge(result[key], value)
          : value;
    });
    return result;
  };

  return sources.reduce<Record<string, unknown>>(
    (acc, source) => (source ? merge(acc, source) : acc),
    {},
  ) as ApexOptions;
}
