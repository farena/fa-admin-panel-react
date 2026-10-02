import type { ApexAxisChartSeries } from "apexcharts";
import Chart, { type ChartBaseProps } from "./Chart";

type ScatterChartProps = ChartBaseProps & {
  series: ApexAxisChartSeries; // data as [x, y] pairs or { x, y } points
  xTitle?: string;
  yTitle?: string;
  markerSize?: number;
};

export default function ScatterChart({
  series,
  xTitle,
  yTitle,
  markerSize = 7,
  ...props
}: ScatterChartProps) {
  return (
    <Chart
      type="scatter"
      series={series}
      defaults={{
        chart: { zoom: { enabled: true, type: "xy" } },
        markers: { size: markerSize, strokeWidth: 0 },
        xaxis: { tickAmount: 8, title: { text: xTitle } },
        yaxis: { tickAmount: 6, title: { text: yTitle } },
        grid: { xaxis: { lines: { show: true } } },
      }}
      {...props}
    />
  );
}
