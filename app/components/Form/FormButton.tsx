import { useRef, useState, type ButtonHTMLAttributes, type MouseEvent, type Ref } from "react";
import { Link, type To } from "react-router";
import FormIcon from "./FormIcon";

type TooltipPosition = "left" | "right" | "top" | "bottom";

type FormButtonProps = Omit<ButtonHTMLAttributes<HTMLElement>, "type"> & {
  type?: "button" | "submit" | "reset";
  theme?: string;
  to?: To | null;
  block?: boolean;
  small?: boolean;
  outlined?: boolean;
  justIcon?: boolean;
  plain?: boolean;
  icon?: string;
  iconMaterial?: boolean;
  tooltip?: string;
  tooltipContainer?: string | HTMLElement;
};

export default function FormButton({
  type = "button",
  theme = "primary",
  to = null,
  block,
  small,
  disabled,
  outlined,
  justIcon,
  plain,
  icon,
  iconMaterial = false,
  tooltip,
  tooltipContainer = ".content-wrapper",
  className,
  children,
  onMouseOver,
  ...props
}: FormButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>("left");

  const adjustTooltipPosition = () => {
    if (!tooltipRef.current || !buttonRef.current) return;

    const wrapper =
      typeof tooltipContainer === "string"
        ? document.querySelector(tooltipContainer)
        : tooltipContainer;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    // Check proximity to the container's right edge
    if (wrapperRect.right - buttonRect.right < tooltipWidth) {
      setTooltipPosition("left");
    }
    // Check proximity to the container's left edge
    else if (buttonRect.left - wrapperRect.left < tooltipWidth) {
      setTooltipPosition("right");
    }
    // Check proximity to the container's bottom edge
    else if (wrapperRect.bottom - buttonRect.bottom < tooltipHeight) {
      setTooltipPosition("top");
    }
    // Check proximity to the container's top edge
    else if (buttonRect.top - wrapperRect.top < tooltipHeight) {
      setTooltipPosition("bottom");
    } else {
      setTooltipPosition("left"); // Default position
    }
  };

  const handleMouseOver = (e: MouseEvent<HTMLElement>) => {
    adjustTooltipPosition();
    onMouseOver?.(e);
  };

  const classes = [
    "btn",
    `btn-${outlined ? "outline-" : ""}${theme}`,
    block && "btn-block",
    small && "btn-sm",
    disabled && "disabled",
    justIcon && "btn-rounded",
    plain && "btn-plain",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {tooltip && (
        <div className={`tooltip ${tooltipPosition}`} ref={tooltipRef}>
          {tooltip}
        </div>
      )}
      <FormIcon icon={icon} iconMaterial={iconMaterial} as="div" prefix="fa" />
      {children != null && children !== false && <span>{children}</span>}
    </>
  );

  if (!to) {
    return (
      <button
        {...props}
        ref={buttonRef as Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        className={classes}
        onMouseOver={handleMouseOver}
      >
        {content}
      </button>
    );
  }

  if (typeof to === "string" && to.slice(0, 4) === "http") {
    return (
      <a
        {...props}
        ref={buttonRef as Ref<HTMLAnchorElement>}
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={disabled || undefined}
        className={classes}
        onMouseOver={handleMouseOver}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      {...props}
      ref={buttonRef as Ref<HTMLAnchorElement>}
      to={to}
      aria-disabled={disabled || undefined}
      className={classes}
      onMouseOver={handleMouseOver}
    >
      {content}
    </Link>
  );
}
