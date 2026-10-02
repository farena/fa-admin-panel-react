import { Children, useState, type ReactNode } from "react";
import { useClassParser } from "~/hooks/useClassParser";

export type Tab = string | { title: string; icon?: string };

type TabsProps = {
  tabs: Tab[];
  underline?: boolean;
  theme?: string;
  header?: ReactNode;
  addTab?: ReactNode; // Rendered at the start of the nav
  removeTab?: (tab: Tab, index: number) => ReactNode; // Rendered inside each tab button
  onChange?: (tab: Tab) => void;
  children?: ReactNode; // One pane per tab, in the same order as `tabs`
};

const tabTitle = (tab: Tab) => (typeof tab === "string" ? tab : tab.title);

export default function Tabs({
  tabs,
  underline = false,
  theme = "dark",
  header,
  addTab,
  removeTab,
  onChange,
  children,
}: TabsProps) {
  const [activeTitle, setActiveTitle] = useState(() =>
    tabs[0] ? tabTitle(tabs[0]) : null,
  );

  // Falls back to the first tab when the active one was removed
  const activeIndex = Math.max(
    tabs.findIndex((tab) => tabTitle(tab) === activeTitle),
    0,
  );

  // forEach keeps null children, so a conditional pane doesn't shift the rest
  const panes: ReactNode[] = [];
  Children.forEach(children, (child) => panes.push(child));

  const switchPanel = (tab: Tab) => {
    setActiveTitle(tabTitle(tab));
    onChange?.(tab);
  };

  return (
    <div
      className={useClassParser({
        tabs: true,
        "tabs-underlined": underline,
        [`tabs-${theme}`]: true,
      })}
    >
      {header && <div className="tabs-head">{header}</div>}

      <div className="tabs-nav">
        {addTab}

        {tabs.map((tab, index) => (
          <div
            key={tabTitle(tab)}
            className={index === activeIndex ? "btn active" : "btn"}
            onClick={() => switchPanel(tab)}
          >
            {typeof tab !== "string" && tab.icon && (
              <div className="icon">
                <i className={tab.icon}></i>
              </div>
            )}
            {tabTitle(tab)}

            {removeTab?.(tab, index)}
          </div>
        ))}
      </div>

      {tabs.length > 0 && (
        <div className="tabs-body">
          <div className={`tabs-pane tabs-pane-${activeIndex + 1}`}>
            {panes[activeIndex] ?? "NO CONTENT TAB"}
          </div>
        </div>
      )}
    </div>
  );
}
