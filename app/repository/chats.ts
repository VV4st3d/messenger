import {
  getAPIRouteChatInfo,
  getAPIRouteChats,
  getAPIRouteMessages,
} from '~/shared/const';
import type {
  TMessages,
  TChat,
  TChats,
} from '~/shared/types';

export function createChatsRepository(appFetch: typeof $fetch) {
  return {
    getChats() {
      return appFetch<TChats>(getAPIRouteChats(), { method: 'GET' });
    },
    getChat(id: string) {
      return appFetch<TChat>(getAPIRouteChatInfo(id), { method: 'GET' });
    },
    getMessages(id: string) {
      return appFetch<TMessages>(getAPIRouteMessages(id), { method: 'GET' });
    },
  };
}
