import type { IUser } from './auth';
import type { TResponseBody } from './base-body';

export type TChats = TResponseBody<IChat[]>;
export type TChat = TResponseBody<Omit<IChat, 'lastMessage'>>;
export type TMessengesResponse = TResponseBody<{
  messages: IMessage[];
  hasMoreTop: boolean;
  hasMoreBottom: boolean;
  total: number;
}>;
export type TMessengesFindResponse = TResponseBody<IMessage[]>;
export type TSendMessageResponse = TResponseBody<IMessage>;
export type TMessagesListById = TResponseBody<IFoundMessageData>;
export type TChatInfo = TResponseBody<
  Omit<IChat, 'participants' | 'lastMessage'>
>;

export interface IChat {
  id: string;
  type: TCHatType;
  name: string;
  createdAt: string;
  updatedAt: string;
  participants: IParticipant[];
  lastMessage?: IMessage;
}

export interface IMessageChat {
  id: string;
  type: 'private' | 'group';
  createAt: string;
  updateAt: string;
}

export interface IParticipant {
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
  sender: IUser;
  chat: IMessageChat;
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

export interface IGetMessageQuery {
  limit?: number;
  cursorCreatedAt?: string;
  direction?: 'before' | 'after';
}

export interface IFoundMessageData {
  messages: IMessage[];
  anchorMessageId: string;
  hasMoreTop: boolean;
  hasMoreBottom: boolean;
}
