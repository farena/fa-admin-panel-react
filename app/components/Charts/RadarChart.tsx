import type { ApexAxisChartSeries } from "apexcharts";
import Chart, { type ChartBaseProps } from "./Chart";

type RadarChartProps = ChartBaseProps & {
  series: ApexAxisChartSeries;
  categories: string[];
  filled?: boolean;
  valueFormatter?: (value: number) => string; // Tooltip
};

export default function RadarChart({
  series,
  categories,
  filled = true,
  valueFormatter,
  ...props
}: RadarChartProps) {
  return (
    <Chart
      type="radar"
      series={series}
      defaults={{
        xaxis: { categories },
        stroke: { width: 2 },
        fill: { opacity: filled ? 0.25 : 0 },
        markers: { size: 3 },
        tooltip: { y: { formatter: valueFormatter } },
      }}
      {...props}
    />
  );
}
