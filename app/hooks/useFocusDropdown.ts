import { useRef, type FocusEvent, type MouseEvent } from "react";

/**
 * Ties a FormDropdown to the focus of its input(s): the dropdown should open on
 * focus and close once the focus leaves both the field and the dropdown content.
 *
 * - `fieldRef` goes on the element wrapping the input(s).
 * - `contentProps(close)` is spread on the dropdown content root. Clicks there
 *   don't steal the focus from the input (so it doesn't blur), except on inner
 *   form controls (e.g. FormTime), which still take the focus without closing.
 * - `onFieldBlur(e, close)` goes on the input(s) blur.
 */
export function useFocusDropdown() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const focusStaysInside = (next: EventTarget | null) =>
    next instanceof Node &&
    (!!fieldRef.current?.contains(next) ||
      !!contentRef.current?.contains(next));

  const onFieldBlur = (e: FocusEvent, close: () => void) => {
    if (!focusStaysInside(e.relatedTarget)) close();
  };

  const contentProps = (close: () => void) => ({
    ref: contentRef,
    onMouseDown: (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("input, select, textarea")) e.preventDefault();
    },
    onBlur: (e: FocusEvent) => onFieldBlur(e, close),
  });

  return { fieldRef, contentProps, onFieldBlur };
}
