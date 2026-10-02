import type { ApexAxisChartSeries } from "apexcharts";
import Chart, { type ChartBaseProps } from "./Chart";

type AreaChartProps = ChartBaseProps & {
  series: ApexAxisChartSeries;
  categories?: (string | number)[];
  curve?: "smooth" | "straight" | "stepline";
  stacked?: boolean;
  valueFormatter?: (value: number) => string; // Y axis labels and tooltip
};

export default function AreaChart({
  series,
  categories,
  curve = "smooth",
  stacked = false,
  valueFormatter,
  ...props
}: AreaChartProps) {
  return (
    <Chart
      type="area"
      series={series}
      defaults={{
        chart: { stacked },
        stroke: { curve, width: 2 },
        fill: {
          type: "gradient",
          gradient: { opacityFrom: 0.45, opacityTo: 0.05 },
        },
        xaxis: { categories },
        yaxis: { labels: { formatter: valueFormatter } },
        tooltip: { y: { formatter: valueFormatter } },
      }}
      {...props}
    />
  );
}
