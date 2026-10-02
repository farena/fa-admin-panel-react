import Widget from "~/components/Widget/Widget";
import LineChart from "~/components/Charts/LineChart";
import AreaChart from "~/components/Charts/AreaChart";
import BarChart from "~/components/Charts/BarChart";
import PieChart from "~/components/Charts/PieChart";
import DonutChart from "~/components/Charts/DonutChart";
import RadialBarChart from "~/components/Charts/RadialBarChart";
import RadarChart from "~/components/Charts/RadarChart";
import ScatterChart from "~/components/Charts/ScatterChart";
import HeatmapChart from "~/components/Charts/HeatmapChart";
import { Section } from "./_PlaygroundLayout";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SOURCES = ["Direct", "Organic", "Referral", "Social", "Email"];

const money = (value: number) => `€${value.toLocaleString()}`;

const SALES = [
  { name: "2025", data: [31, 40, 28, 51, 42, 109, 100, 91, 120] },
  { name: "2026", data: [11, 32, 45, 32, 34, 52, 41, 60, 75] },
];

const HEATMAP = ["Morning", "Afternoon", "Evening", "Night"].map(
  (name, row) => ({
    name,
    data: DAYS.map((x, col) => ({ x, y: ((row + 1) * (col + 3) * 7) % 90 })),
  }),
);

const SCATTER = ["Group A", "Group B"].map((name, group) => ({
  name,
  data: Array.from({ length: 20 }, (_, i) => [
    i + 1,
    Math.round(20 + group * 25 + ((i * 37) % 30)),
  ]),
}));

export default function ChartsPlayground() {
  return (
    <Section title="Charts">
      <div className="row">
        <div className="col-md-6 mb-4">
          <Widget title="LineChart" description="smooth, markers">
            <LineChart series={SALES} categories={MONTHS} markers />
          </Widget>
        </div>
        <div className="col-md-6 mb-4">
          <Widget title="AreaChart" description="valueFormatter">
            <AreaChart
              series={SALES}
              categories={MONTHS}
              valueFormatter={money}
            />
          </Widget>
        </div>
        <div className="col-md-6 mb-4">
          <Widget title="BarChart" description="stacked columns">
            <BarChart series={SALES} categories={MONTHS} stacked />
          </Widget>
        </div>
        <div className="col-md-6 mb-4">
          <Widget title="BarChart" description="horizontal, data labels">
            <BarChart
              series={[{ name: "Visits", data: [400, 430, 448, 470, 540] }]}
              categories={SOURCES}
              horizontal
              dataLabels
            />
          </Widget>
        </div>
        <div className="col-md-4 mb-4">
          <Widget title="PieChart">
            <PieChart series={[44, 55, 13, 43, 22]} labels={SOURCES} />
          </Widget>
        </div>
        <div className="col-md-4 mb-4">
          <Widget title="DonutChart" description="with total">
            <DonutChart
              series={[1200, 850, 430]}
              labels={["Paid", "Pending", "Refunded"]}
              totalLabel="Total"
              valueFormatter={money}
            />
          </Widget>
        </div>
        <div className="col-md-4 mb-4">
          <Widget title="RadialBarChart" description="multiple, with average">
            <RadialBarChart
              series={[76, 67, 61]}
              labels={["Rooms", "Parking", "Spa"]}
              totalLabel="Average"
            />
          </Widget>
        </div>
        <div className="col-md-4 mb-4">
          <Widget title="RadialBarChart" description="semicircle gauge">
            <RadialBarChart series={[87]} labels={["Occupancy"]} semicircle />
          </Widget>
        </div>
        <div className="col-md-4 mb-4">
          <Widget title="RadarChart">
            <RadarChart
              series={[
                { name: "Hotel A", data: [80, 50, 30, 40, 100, 20] },
                { name: "Hotel B", data: [20, 30, 40, 80, 20, 80] },
              ]}
              categories={["Price", "Location", "Staff", "Rooms", "Food", "Wifi"]}
            />
          </Widget>
        </div>
        <div className="col-md-4 mb-4">
          <Widget title="ScatterChart">
            <ScatterChart series={SCATTER} xTitle="Day" yTitle="Bookings" />
          </Widget>
        </div>
        <div className="col-md-6 mb-4">
          <Widget title="HeatmapChart" description="single color">
            <HeatmapChart series={HEATMAP} />
          </Widget>
        </div>
        <div className="col-md-6 mb-4">
          <Widget title="HeatmapChart" description="color ranges">
            <HeatmapChart
              series={HEATMAP}
              dataLabels
              ranges={[
                { from: 0, to: 30, color: "#7ad7e4", name: "Low" },
                { from: 31, to: 60, color: "#ffba3b", name: "Medium" },
                { from: 61, to: 100, color: "#e14319", name: "High" },
              ]}
            />
          </Widget>
        </div>
      </div>
    </Section>
  );
}
