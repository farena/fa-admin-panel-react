import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type Position = "top" | "bottom" | "left" | "right";

type SlotParams = {
  open: () => void;
  close: (timeout?: number) => void;
};

type Slot = (params: SlotParams) => ReactNode;

type FormDropdownProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  position?: Position;
  keepOpen?: Boolean;
  parentEl?: string | HTMLElement;
  slots?: Record<string, Slot>;
  children?: ReactNode | Slot;
};

export default function FormDropdown({
  position = "bottom",
  keepOpen = false,
  parentEl,
  slots,
  children,
}: FormDropdownProps) {
  const [ready, setReady] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getParent = useCallback((): HTMLElement | null => {
    if (!parentEl) {
      return buttonRef.current?.parentElement ?? null;
    }

    if (typeof parentEl === "string") {
      return document.querySelector<HTMLElement>(parentEl);
    }

    return parentEl;
  }, [parentEl]);

  // Coordinates are relative to the viewport (the dropdown is position: fixed)
  const positionDropdown = useCallback(
    (position: Position = "bottom", minWidth = 250) => {
      const parentElem = getParent();
      const dropdownEl = dropdownRef.current;

      if (!dropdownEl || !parentElem) return null;

      const parentRect = parentElem.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;

      const parentWidth = parentRect.width;
      const dropdownHeight = dropdownEl.offsetHeight;
      const dropdownWidth = parentWidth < minWidth ? minWidth : parentWidth;
      let top: number;
      let left: number;

      switch (position) {
        case "top":
          top = parentRect.top - dropdownHeight;
          left = parentRect.left;

          // Check if too close to the top edge
          if (top < 0) {
            top = parentRect.bottom;
          }
          // Set left regarding minWidth
          if (parentWidth < minWidth) {
            left = parentRect.left - (minWidth - parentWidth);
          }
          // Check if too close to the left edge
          if (left < 0) {
            left = parentRect.right;
          }
          break;
        case "left":
          top = parentRect.top;
          left = parentRect.left - parentWidth;

          // Check if too close to the left edge
          if (left < 0) {
            left = parentRect.right;
          }
          if (parentWidth < minWidth) {
            left = left - (minWidth - parentWidth);
          }
          break;
        case "right":
          top = parentRect.top;
          left = parentRect.right;

          // Check if too close to the right edge
          if (left + dropdownWidth > viewportWidth) {
            left = parentRect.left - dropdownWidth;
          }
          break;
        case "bottom":
        default: {
          top = parentRect.bottom;
          left = parentRect.left;

          // Check if too close to the bottom edge (default is bottom)
          if (top + dropdownHeight > viewportHeight) {
            top = parentRect.top - dropdownHeight;
          }

          // Set left regarding minWidth
          if (parentWidth < minWidth) {
            left = parentRect.left - (minWidth - parentWidth);
          }
          // Check if too close to the left edge
          if (left < 0) {
            left = parentRect.right;
          }
        }
      }

      return { top, left, width: dropdownWidth };
    },
    [getParent],
  );

  const updatePosition = useCallback(() => {
    const dropdownEl = dropdownRef.current;
    const result = positionDropdown(position);
    if (!dropdownEl || !result) return;

    dropdownEl.style.top = `${result.top}px`;
    dropdownEl.style.left = `${result.left}px`;
    dropdownEl.style.width = `${result.width}px`;
  }, [positionDropdown, position]);

  const closeDropdown = useCallback((timeout = 0) => {
    setTimeout(() => setDropdownOpen(false), timeout);
  }, []);

  const openDropdown = useCallback(() => {
    setDropdownOpen(true);
  }, []);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prevVal) => !prevVal);
  }, []);

  // mounted hoook.
  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 100);

    return () => clearTimeout(timer);
  });

  // Position the dropdown once it's rendered
  useLayoutEffect(() => {
    if (dropdownOpen) updatePosition();
  }, [dropdownOpen, updatePosition]);

  // Close on click outside, scroll or resize while the dropdown is open
  useEffect(() => {
    if (!dropdownOpen) return;

    const clickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutside =
        !dropdownRef.current?.contains(target) &&
        !getParent()?.contains(target);

      if (isOutside) closeDropdown();
    };

    // The dropdown is fixed on screen, so any scroll or resize would leave it misplaced
    const scrollOutside = (e: Event) => {
      if (!dropdownRef.current?.contains(e.target as Node)) closeDropdown();
    };
    const onResize = () => closeDropdown();

    const timer = setTimeout(() => {
      window.addEventListener("mousedown", clickOutside);
    }, 100);
    window.addEventListener("scroll", scrollOutside, true);
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousedown", clickOutside);
      window.removeEventListener("scroll", scrollOutside, true);
      window.removeEventListener("resize", onResize);
    };
  }, [dropdownOpen, getParent, closeDropdown]);

  return (
    <>
      {slots?.action ? (
        slots.action({ open: openDropdown, close: closeDropdown })
      ) : (
        <button
          ref={buttonRef}
          style={{ position: "relative" }}
          className="btn btn-primary"
          onClick={toggleDropdown}
        >
          Open dropdown
        </button>
      )}
      {ready &&
        dropdownOpen &&
        createPortal(
          <div
            className="form-dropdown"
            style={{ position: "fixed" }}
            ref={dropdownRef}
          >
            {typeof children === "function"
              ? children({ open: openDropdown, close: closeDropdown })
              : children}
          </div>,
          document.body,
        )}
    </>
  );
}
