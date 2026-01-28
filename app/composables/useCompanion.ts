import { computed, toValue, useAuth } from '#imports';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import type { IChat, IParticipant } from '~/shared/types';

export const useCompanion = (
  chatItem: MaybeRefOrGetter<IChat | null>,
): ComputedRef<IParticipant | null | undefined> => {
  const { user } = useAuth();
  return computed(() => {
    const chat = toValue(chatItem);
    if (chat?.type === 'private') {
      return chat.participants.find((usr) => usr.id !== user.value?.id);
    }
    return null;
  });
};
