export const API_ROUTES = {
  getRouteCheckEmail() {
    return 'auth/check-email';
  },
  getRouteRegister() {
    return 'auth/register';
  },
  getRouteLogin() {
    return 'auth/login';
  },
  getRouteAuthMe() {
    return 'auth/me';
  },
  getRouteFriends() {
    return 'friends';
  },
  getRouteChats() {
    return 'chats';
  },
  getRouteChatInfo(id: string) {
    return `chats/${id}`;
  },
  getRouteMessages(id: string) {
    return `messages/${id}`;
  },
  getRouteSendMessage() {
    return 'messages';
  },
  getRouteSearchMessages(id: string) {
    return `messages/${id}/search`;
  },
  getRouteGlobalSearchMessages() {
    return `messages/search`;
  },
  getRouteMessagesByMessageId(id: string) {
    return `messages/${id}/context`;
  },
};
