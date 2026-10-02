import { useMemo } from "react";
import ReactApexChart, { type Props } from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { BASE_OPTIONS, mergeOptions } from "./_chartDefaults";

// Props shared by every chart in this folder
export type ChartBaseProps = {
  height?: number | string;
  width?: number | string;
  options?: ApexOptions; // Raw ApexCharts options, merged over the chart defaults
};

type ChartProps = ChartBaseProps & {
  type: NonNullable<Props["type"]>;
  series: ApexOptions["series"];
  defaults?: ApexOptions; // Chart-type defaults, applied between the base and `options`
};

// Renders an empty div on the server; ApexCharts mounts on the client
export default function Chart({
  type,
  series,
  defaults,
  options,
  height = 350,
  width = "100%",
}: ChartProps) {
  const merged = useMemo(
    () => mergeOptions(BASE_OPTIONS, defaults, options),
    [defaults, options],
  );

  return (
    <ReactApexChart
      type={type}
      series={series}
      options={merged}
      height={height}
      width={width}
    />
  );
}
