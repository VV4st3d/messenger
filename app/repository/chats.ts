import { API_ROUTES } from '~/shared/const';
import type { TMessages, TChat, TChats } from '~/shared/types';

export function createChatsRepository(appFetch: typeof $fetch) {
  return {
    getChats() {
      return appFetch<TChats>(API_ROUTES.getRouteChats(), { method: 'GET' });
    },
    getChat(id: string) {
      return appFetch<TChat>(API_ROUTES.getRouteChatInfo(id), {
        method: 'GET',
      });
    },
    getMessages(id: string) {
      return appFetch<TMessages>(API_ROUTES.getRouteMessages(id), {
        method: 'GET',
      });
    },
  };
}
