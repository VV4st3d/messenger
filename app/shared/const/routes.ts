export const RouteNames = {
  MAIN: 'index',
  AUTH: 'auth',
} as const;

export const getRouteAuth = () => '/auth';
export const getRouteChats = () => '/chats';
export const getRouteChat = (id: string) => `/chat/${id}`;
