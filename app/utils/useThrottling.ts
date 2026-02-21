/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';

export const useThrottling = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) => {
  const isThrottling = ref(false);

  return (...args: Parameters<T>) => {
    if (isThrottling.value) {
      return;
    }
    callback(...args);
    isThrottling.value = true;
    setTimeout(() => {
      isThrottling.value = false;
    }, delay);
  };
};
