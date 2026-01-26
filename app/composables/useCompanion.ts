import { computed, useAuth } from '#imports';
import type { ComputedRef } from 'vue';
import type { IChat, IParticipant } from '~/shared/types';

export const useCompanion = (
  chat: IChat | null,
): ComputedRef<IParticipant | null | undefined> => {
  const { user } = useAuth();
  return computed(() => {
    if (chat?.type === 'private') {
      return chat?.participants.find((usr) => usr.id !== user.value?.id);
    }
    return null;
  });
};
