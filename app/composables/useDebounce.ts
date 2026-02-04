/* eslint-disable @typescript-eslint/no-explicit-any */
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
