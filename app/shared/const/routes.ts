export const RouteNames = {
  MAIN: 'index',
  AUTH: 'auth',
} as const;

export const ROUTES = {
  getRouteAuth() {
    return '/auth';
  },
  getRouteChats() {
    return '/chats';
  },
  getRouteChat(id: string) {
    return `/chat/${id}`;
  },
  getRouteProfile(id: string) {
    return `/profile/${id}`;
  },
};
