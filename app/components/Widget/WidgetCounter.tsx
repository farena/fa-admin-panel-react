import type { ReactNode } from "react";
import { useClassParser } from "~/hooks/useClassParser";
import "./_widget_counter.scss";

type WidgetCounterProps = {
  title?: string;
  description?: string;
  count?: number | string;
  moneySign?: string;
  small?: boolean;
  tooltip?: string;
  children?: ReactNode; // Rendered as a chart next to the count
};

export default function WidgetCounter({
  title,
  description,
  count,
  moneySign,
  small = false,
  tooltip,
  children,
}: WidgetCounterProps) {
  return (
    <div
      className={useClassParser({
        "counter-widget": true,
        "counter-widget-small": small,
      })}
    >
      <div className="counter-widget-head">
        <h6>{title}</h6>
        {tooltip && (
          <span className="fa fa-circle-info counter-widget-info">
            <span className="tooltip bottom-left counter-widget-tooltip">
              {tooltip}
            </span>
          </span>
        )}
      </div>
      <div className="counter-widget-body">
        <div>
          <h3>
            {moneySign}
            {count}
          </h3>
          {description && <p className="small m-0">{description}</p>}
        </div>

        {children && <div className="chart">{children}</div>}
      </div>
    </div>
  );
}
