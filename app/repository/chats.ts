import { API_ROUTES } from '~/shared/const';
import type {
  TMessengesResponse,
  TMessengesFindResponse,
  TChat,
  TChats,
  IGetMessageQuery,
  TMessagesListById,
  TChatInfo,
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
    getChatMessagesBySearch(id: string, query: { query: string }) {
      return appFetch<TMessengesFindResponse>(
        API_ROUTES.getRouteSearchMessages(id),
        {
          method: 'GET',
          query,
        },
      );
    },
    getGlobalChatsMessagesBySearch(query: { query: string }) {
      return appFetch<TMessengesFindResponse>(
        API_ROUTES.getRouteGlobalSearchMessages(),
        {
          method: 'GET',
          query,
        },
      );
    },
    getMessagesListByMessageId(id: string) {
      return appFetch<TMessagesListById>(
        API_ROUTES.getRouteMessagesByMessageId(id),
        {
          method: 'GET',
        },
      );
    },
    createOrGetPrivateChat(body: { otherUserId: string }) {
      return appFetch<TChatInfo>(API_ROUTES.getRouteCreateOrGetChat(), {
        method: 'POST',
        body,
      });
    },
  };
}
