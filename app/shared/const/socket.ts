export const SOCKET_EMIT_EVENTS = {
  JOIN_CHAT: 'joinChat',
  SEND_MESSAGE: 'sendMessage',
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',
} as const;

export const SOCKET_ON_EVENTS = {
  USER_STATUS: 'userStatus',
  DISCONNECT: 'disconnect',
  CONNECT: 'connect',
  NEW_MESSAGE: 'newMessage',
  TYPING: 'typing',
} as const;
