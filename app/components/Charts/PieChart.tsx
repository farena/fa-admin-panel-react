import Chart, { type ChartBaseProps } from "./Chart";

type PieChartProps = ChartBaseProps & {
  series: number[];
  labels: string[];
  valueFormatter?: (value: number) => string; // Tooltip
};

export default function PieChart({
  series,
  labels,
  valueFormatter,
  ...props
}: PieChartProps) {
  return (
    <Chart
      type="pie"
      series={series}
      defaults={{
        labels,
        legend: { position: "bottom" },
        dataLabels: { enabled: true },
        stroke: { width: 2 },
        tooltip: { y: { formatter: valueFormatter } },
      }}
      {...props}
    />
  );
}
