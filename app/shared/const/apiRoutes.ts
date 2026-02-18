
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
  getRouteSearchFriend() {
    return 'friends/search';
  },
  getRouteFriendRequest() {
    return 'friends/request';
  },
  getRouteIncomingFriendRequests() {
    return 'friends/incoming';
  },
  getRouteOutgoingFriendRequests() {
    return 'friends/outgoing';
  },
  getRouteAcceptFriendRequest(id: string) {
    return `friends/accept/${id}`;
  },
  getRouteRejectFriendRequest(id: string) {
    return `friends/reject/${id}`;
  },
  getRouteCancelFriendRequest(id: string) {
    return `friends/request/${id}`;
  },
  getRouteRemoveFriend(id: string) {
    return `friends/delete/${id}`;
  },
  getRouteChats() {
    return 'chats';
  },
  getRouteChatInfo(id: string) {
    return `chats/${id}`;
  },
  getRouteCreateOrGetChat() {
    return 'chats/private';
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
  getRoutePinnedMessages(chatId: string) {
    return `messages/${chatId}/pinned`;
  },
  getRoutePinMessage(messageId: string) {
    return `messages/${messageId}/pin`;
  },
  getRouteUnpinMessage(messageId: string) {
    return `messages/${messageId}/unpin`;
  },
  getRouteAISummary(messageId: string) {
    return `ai/${messageId}/summary`;
  },
  getRouteUploadFile() {
    return 'messages/upload';
  },
};
