import type { ApexAxisChartSeries } from "apexcharts";
import Chart, { type ChartBaseProps } from "./Chart";
import { CHART_COLORS } from "./_chartDefaults";

export type HeatmapRange = {
  from: number;
  to: number;
  color: string;
  name?: string;
};

type HeatmapChartProps = ChartBaseProps & {
  series: ApexAxisChartSeries; // One row per series, data as { x, y } cells
  color?: string; // Base color, shaded by value when no `ranges` are given
  ranges?: HeatmapRange[];
  dataLabels?: boolean;
};

export default function HeatmapChart({
  series,
  color = CHART_COLORS[0],
  ranges,
  dataLabels = false,
  ...props
}: HeatmapChartProps) {
  return (
    <Chart
      type="heatmap"
      series={series}
      defaults={{
        colors: [color],
        dataLabels: { enabled: dataLabels },
        legend: { show: !!ranges },
        stroke: { width: 2, colors: ["#fff"] },
        plotOptions: {
          heatmap: {
            radius: 4,
            shadeIntensity: 0.6,
            // ApexCharts crashes when colorScale is missing, so always send it
            colorScale: { ranges: ranges ?? [] },
          },
        },
      }}
      {...props}
    />
  );
}
