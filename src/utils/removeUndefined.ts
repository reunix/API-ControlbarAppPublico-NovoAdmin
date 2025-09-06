export function removeUndefined<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined) // só usa o valor
  ) as Partial<T>;
}
