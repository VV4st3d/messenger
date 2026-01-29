/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';

export const useThrottling = (
  callback: (...args: any[]) => void,
  delay: number,
) => {
  const isThrottling = ref(false);

  return (...args: any) => {
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
