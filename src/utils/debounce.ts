import { createSignal, onCleanup } from "solid-js";

export function createDebouncedSignal<T>(initialValue: T, delay = 300) {
  const [value, setValue] = createSignal<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = createSignal<T>(initialValue);

  let timeoutId: number | undefined;

  const set = (newValue: T) => {
    setValue(() => newValue);

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      setDebouncedValue(() => newValue);
    }, delay) as unknown as number;
  };

  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });

  return [value, set, debouncedValue] as const;
}
