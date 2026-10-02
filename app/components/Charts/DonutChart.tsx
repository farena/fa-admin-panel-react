import Chart, { type ChartBaseProps } from "./Chart";

type DonutChartProps = ChartBaseProps & {
  series: number[];
  labels: string[];
  totalLabel?: string; // Shows the sum of the series in the center
  valueFormatter?: (value: number) => string; // Center values and tooltip
};

export default function DonutChart({
  series,
  labels,
  totalLabel,
  valueFormatter,
  ...props
}: DonutChartProps) {
  const format = (value: number) =>
    valueFormatter ? valueFormatter(value) : String(value);

  return (
    <Chart
      type="donut"
      series={series}
      defaults={{
        labels,
        legend: { position: "bottom" },
        stroke: { width: 2 },
        plotOptions: {
          pie: {
            donut: {
              size: "70%",
              labels: {
                show: !!totalLabel,
                value: { formatter: (value) => format(+value) },
                total: {
                  show: !!totalLabel,
                  label: totalLabel,
                  formatter: (w) =>
                    format(
                      w.globals.seriesTotals.reduce(
                        (sum: number, value: number) => sum + value,
                        0,
                      ),
                    ),
                },
              },
            },
          },
        },
        tooltip: { y: { formatter: valueFormatter } },
      }}
      {...props}
    />
  );
}
