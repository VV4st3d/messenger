
export const SOCKET_EMIT_EVENTS = {
  JOIN_CHAT: 'joinChat',
  SEND_MESSAGE: 'sendMessage',
} as const;

export const SOCKET_ON_EVENTS = {
  USER_STATUS: 'userStatus',
  DISCONNECT: 'disconnect',
  CONNECT: 'connect',
  NEW_MESSAGE: 'newMessage',
} as const;
