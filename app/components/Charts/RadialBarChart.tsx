import Chart, { type ChartBaseProps } from "./Chart";

type RadialBarChartProps = ChartBaseProps & {
  series: number[]; // Percentages (0-100)
  labels: string[];
  totalLabel?: string; // Shows the average of the series in the center
  semicircle?: boolean;
};

export default function RadialBarChart({
  series,
  labels,
  totalLabel,
  semicircle = false,
  ...props
}: RadialBarChartProps) {
  return (
    <Chart
      type="radialBar"
      series={series}
      defaults={{
        labels,
        legend: { show: series.length > 1, position: "bottom" },
        plotOptions: {
          radialBar: {
            startAngle: semicircle ? -90 : 0,
            endAngle: semicircle ? 90 : 360,
            hollow: { size: series.length > 1 ? "35%" : "60%" },
            track: { background: "#f3f3f3" },
            dataLabels: {
              value: { formatter: (value) => `${Math.round(value)}%` },
              total: {
                show: !!totalLabel,
                label: totalLabel,
                formatter: (w) =>
                  `${Math.round(
                    w.globals.seriesTotals.reduce(
                      (sum: number, value: number) => sum + value,
                      0,
                    ) / w.globals.series.length,
                  )}%`,
              },
            },
          },
        },
        stroke: { lineCap: "round" },
      }}
      {...props}
    />
  );
}
