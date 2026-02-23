import type { IMessage, TMessageType } from './chat';

export interface UserStatus {
  userId: string;
  online: boolean;
  lastActive: string;
}

export type TSocketEmitPayload<T extends keyof IEmitEvents> = IEmitEvents[T];
export type TSocketOnPayload<T extends keyof IOnEvents> = IOnEvents[T];

interface IEmitEvents {
  joinChat: string;
  sendMessage: { chatId: string; content: string; type: TMessageType };
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

export type TSocketEmitEvents = keyof IEmitEvents;
export type TSocketOnEvents = keyof IOnEvents;

export interface ITyping {
  userId: string;
  chatId: string;
  username?: string;
  isTyping: boolean;
}
