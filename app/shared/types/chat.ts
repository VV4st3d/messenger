import type { TResponseBody } from './base-body';

export type TChats = TResponseBody<IChat[]>;
export type TChat = TResponseBody<Omit<IChat, 'lastMessage'>>;
export type TMessages = TResponseBody<IMessage[]>;
export type TSendMessageResponse = TResponseBody<IMessage>;

export interface IChat {
  id: string;
  type: TCHatType;
  name: string;
  createdAt: string;
  updatedAt: string;
  participants: IParticipant[];
  lastMessage?: IMessage;
}

interface IParticipant {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  lastActive: string;
  avatarUrl: string;
  status: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text';
  isRead: boolean;
  createdAt: string;
}

type TCHatType = 'private' | 'group';

export interface IMessageBody {
  chatId: string;
  content: string;
  type: 'text';
}
