import type { SOCKET_EMIT_EVENTS, SOCKET_ON_EVENTS } from '../const';
import type { IMessage } from './chat';
import type { valueOf } from './helpers';

export interface UserStatus {
  userId: string;
  online: boolean;
  lastActive: string;
}

export type TSocketEmitPayload<T extends keyof IEmitEvents> = IEmitEvents[T];
export type TSocketOnPayload<T extends keyof IOnEvents> = IOnEvents[T];

interface IEmitEvents {
  joinChat: string;
  sendMessage: { chatId: string; content: string; type: 'text' | 'file' };
  typing: string;
  stopTyping: string;
}

interface IOnEvents {
  userStatus: UserStatus;
  disconnect: null;
  connect: null;
  newMessage: IMessage;
  typing: ITyping;
}

export type TSocketEmitEvents = valueOf<typeof SOCKET_EMIT_EVENTS>;
export type TSocketOnEvents = valueOf<typeof SOCKET_ON_EVENTS>;

export interface ITyping {
  userId: string;
  chatId: string;
  username?: string;
  isTyping: boolean;
}
