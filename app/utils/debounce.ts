interface DebounceOptions<TArgs extends unknown[]> {
  callback: (...args: TArgs) => unknown;
  delay?: number;
  startedCallback?: () => void;
  finalCallback?: (() => void) | undefined;
}

const isPromise = (value: unknown): value is Promise<unknown> => {
  return value instanceof Promise;
};

export default function debounce<TArgs extends unknown[]>({
  callback,
  delay = 250,
  startedCallback,
  finalCallback,
}: DebounceOptions<TArgs>): (...args: TArgs) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs): void => {
    clearTimeout(timeout);
    if (startedCallback) startedCallback();

    timeout = setTimeout(() => {
      const result = callback(...args);
      if (isPromise(result)) {
        result.finally(finalCallback);
      } else {
        if (finalCallback) finalCallback();
      }
    }, delay);
  };
}
