import type { ReactNode } from "react";
import { useClassParser } from "~/hooks/useClassParser";

type WidgetProps = {
  icon?: string;
  plain?: boolean;
  pretitle?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  buttons?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode; // Shows a loader placeholder while empty
};

export default function Widget({
  icon,
  plain = false,
  pretitle,
  title,
  description,
  buttons,
  footer,
  children,
}: WidgetProps) {
  return (
    <div
      className={useClassParser({
        "card widget h-auto": true,
        "widget-plain": plain,
      })}
    >
      {(icon || title || buttons) && (
        <div className="card-header">
          {pretitle}

          {icon && <i className={`widget-icon ${icon}`}></i>}
          <div className="widget-title">
            <h3>{title}</h3>

            {description && (
              <small className="widget-desc">{description}</small>
            )}
          </div>

          {buttons && <div className="buttons">{buttons}</div>}
        </div>
      )}
      <div className="card-body">
        {children ?? (
          <div className="widget-loader">
            <div className="lds-spinner">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i}></div>
              ))}
            </div>
          </div>
        )}
      </div>
      {footer}
    </div>
  );
}
