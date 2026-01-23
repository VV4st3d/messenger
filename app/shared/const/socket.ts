export const SOCKET_EVENTS: Record<TSocketEvents, string> = {
  USER_STATUS: 'userStatus',
  DISCONNECT: 'disconnect',
  CONNECT: 'connect',
  MESSAGE: 'message',
  MESSAGE_READ: 'messageRead',
  MESSAGE_DELIVERED: 'messageDelivered',
};

type TSocketEvents =
  | 'USER_STATUS'
  | 'DISCONNECT'
  | 'CONNECT'
  | 'MESSAGE'
  | 'MESSAGE_READ'
  | 'MESSAGE_DELIVERED';
