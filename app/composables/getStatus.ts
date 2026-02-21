import { computed, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';

export const getStatus = (
  isOnline: MaybeRefOrGetter<boolean | undefined | null>,
): ComputedRef<string> => {
  return computed(() => {
    const status = toValue(isOnline);
    return status ? 'Онлайн' : 'Оффлайн';
  });
};
