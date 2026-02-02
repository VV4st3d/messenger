import { API_ROUTES } from '~/shared/const';
import type {
  TMessengesResponse,
  TChat,
  TChats,
  IGetMessageQuery,
} from '~/shared/types';

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
    getMessages(id: string, query?: IGetMessageQuery) {
      return appFetch<TMessengesResponse>(API_ROUTES.getRouteMessages(id), {
        method: 'GET',
        query: {
          ...query,
        },
      });
    },
  };
}
