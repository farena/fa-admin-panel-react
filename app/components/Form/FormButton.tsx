import { useRef, useState, type ButtonHTMLAttributes, type MouseEvent, type Ref } from "react";
import { Link, type To } from "react-router";

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

    // Verifica la proximidad al borde derecho del contenedor
    if (wrapperRect.right - buttonRect.right < tooltipWidth) {
      setTooltipPosition("left");
    }
    // Verifica la proximidad al borde izquierdo del contenedor
    else if (buttonRect.left - wrapperRect.left < tooltipWidth) {
      setTooltipPosition("right");
    }
    // Verifica la proximidad al borde inferior del contenedor
    else if (wrapperRect.bottom - buttonRect.bottom < tooltipHeight) {
      setTooltipPosition("top");
    }
    // Verifica la proximidad al borde superior del contenedor
    else if (buttonRect.top - wrapperRect.top < tooltipHeight) {
      setTooltipPosition("bottom");
    } else {
      setTooltipPosition("left"); // Posición por defecto
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
      {icon && (
        <div className="icon">
          <i className={`fa ${icon}`}></i>
        </div>
      )}
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
