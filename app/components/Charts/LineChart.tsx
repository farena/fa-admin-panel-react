import type { ApexAxisChartSeries } from "apexcharts";
import Chart, { type ChartBaseProps } from "./Chart";

type LineChartProps = ChartBaseProps & {
  series: ApexAxisChartSeries;
  categories?: (string | number)[];
  curve?: "smooth" | "straight" | "stepline";
  markers?: boolean;
  valueFormatter?: (value: number) => string; // Y axis labels and tooltip
};

export default function LineChart({
  series,
  categories,
  curve = "smooth",
  markers = false,
  valueFormatter,
  ...props
}: LineChartProps) {
  return (
    <Chart
      type="line"
      series={series}
      defaults={{
        stroke: { curve, width: 3 },
        markers: { size: markers ? 4 : 0, hover: { size: 5 } },
        xaxis: { categories },
        yaxis: { labels: { formatter: valueFormatter } },
        tooltip: { y: { formatter: valueFormatter } },
      }}
      {...props}
    />
  );
}
