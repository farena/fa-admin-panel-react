import Widget from "~/components/Widget/Widget";
import WidgetCounter from "~/components/Widget/WidgetCounter";
import { Example, Section } from "./_PlaygroundLayout";

export default function WidgetPlayground() {
  return (
    <Section title="Widget / WidgetCounter">
      <div className="row">
        <div className="col-md-6">
          <Example title="Widget with icon, description and buttons">
            <Widget
              icon="fa fa-chart-line"
              title="Revenue"
              description="Last 30 days"
              buttons={<button className="btn btn-sm btn-primary">See all</button>}
              footer={<div className="card-footer small">Widget footer</div>}
            >
              <p className="m-0">Widget content</p>
            </Widget>
          </Example>
        </div>
        <div className="col-md-6">
          <Example title="Widget without content (loader)">
            <Widget title="Loading widget" />
          </Example>
        </div>
        <div className="col-md-6">
          <Example title="Plain widget">
            <Widget title="Plain" plain>
              <p className="m-0">Widget content</p>
            </Widget>
          </Example>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <Example title="WidgetCounter">
            <WidgetCounter
              title="Bookings"
              count={128}
              description="+12% vs last month"
            />
          </Example>
        </div>
        <div className="col-md-4">
          <Example title="WidgetCounter with money sign and tooltip">
            <WidgetCounter
              title="Revenue"
              count="12,450"
              moneySign="€"
              tooltip="Sum of all paid invoices in the selected period"
            />
          </Example>
        </div>
        <div className="col-md-4">
          <Example title="WidgetCounter with chart">
            <WidgetCounter title="Occupancy" count="87%" small>
              <i className="fa fa-chart-pie fa-2x"></i>
            </WidgetCounter>
          </Example>
        </div>
      </div>
    </Section>
  );
}
