import type { ApexAxisChartSeries } from "apexcharts";
import Chart, { type ChartBaseProps } from "./Chart";

type BarChartProps = ChartBaseProps & {
  series: ApexAxisChartSeries;
  categories?: (string | number)[];
  horizontal?: boolean;
  stacked?: boolean;
  dataLabels?: boolean;
  valueFormatter?: (value: number) => string; // Value axis labels, data labels and tooltip
};

export default function BarChart({
  series,
  categories,
  horizontal = false,
  stacked = false,
  dataLabels = false,
  valueFormatter,
  ...props
}: BarChartProps) {
  const valueLabels = { labels: { formatter: valueFormatter } };

  return (
    <Chart
      type="bar"
      series={series}
      defaults={{
        chart: { stacked },
        plotOptions: {
          bar: { horizontal, borderRadius: 4, columnWidth: "55%" },
        },
        dataLabels: {
          enabled: dataLabels,
          formatter: valueFormatter && ((value) => valueFormatter(+value)),
        },
        // On horizontal bars the values live on the x axis
        xaxis: { categories, ...(horizontal && valueLabels) },
        yaxis: horizontal ? {} : valueLabels,
        tooltip: { y: { formatter: valueFormatter } },
      }}
      {...props}
    />
  );
}
