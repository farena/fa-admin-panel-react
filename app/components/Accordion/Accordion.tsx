import { useState, type ReactNode } from "react";
import { useClassParser } from "~/hooks/useClassParser";

type AccordionProps = {
  title?: string;
  hasError?: boolean;
  openOnInit?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children?: ReactNode;
};

export default function Accordion({
  title,
  hasError = false,
  openOnInit = false,
  onOpen,
  onClose,
  children,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(openOnInit);

  const toggle = () => {
    if (isOpen) onClose?.();
    else onOpen?.();
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={useClassParser({
        accordion: true,
        "accordion-open": isOpen,
        "accordion-error": hasError,
      })}
    >
      <div className="accordion-head" onClick={toggle}>
        <span>{title}</span>
        <span className="arrow material-symbols-outlined">
          keyboard_arrow_down
        </span>
      </div>
      <div className="accordion-body">
        <div className="accordion-container">{children}</div>
      </div>
    </div>
  );
}
