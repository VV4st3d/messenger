export const getAPIRouteCheckEmail = () => 'auth/check-email';
export const getAPIRouteRegister = () => 'auth/register';
export const getAPIRouteLogin = () => 'auth/login';
export const getAPIRouteAuthMe = () => 'auth/me';
export const getAPIRouteFriends = () => 'friends';
export const getAPIRouteChats = () => `chats`;
export const getAPIRouteChatInfo = (id: string) => `chats/${id}`;
export const getAPIRouteMessages = (id: string) => `messages/${id}`;
export const getAPIRouteSendMessage = () => 'messages';
