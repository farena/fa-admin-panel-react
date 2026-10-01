export function useClassParser(classObj: Record<string, boolean>) {
  return Object.entries(classObj)
    .filter(([, active]) => active)
    .map(([className]) => className)
    .join(" ");
}
