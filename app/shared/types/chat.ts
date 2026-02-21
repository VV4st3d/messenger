import type { IResponseBody } from './base-body';

export type TChats = IResponseBody<IChat[]>;
export type TChat = IResponseBody<Omit<IChat, 'lastMessage'>>;
export type TMessegesResponse = IResponseBody<{
  messages: IMessage[];
  hasMoreTop: boolean;
  hasMoreBottom: boolean;
  direction: 'initial';
}>;
export type TMessengesFindResponse = IResponseBody<IMessage[]>;

export type TPinnedMessagesResponse = IResponseBody<IMessage[]>;
export type TMessageResponse = IResponseBody<IMessage>;

export type TSummaryMessage = IResponseBody<ISummaryMessage>;

export type TMessagesListById = IResponseBody<IFoundMessageData>;
export type TChatInfo = IResponseBody<
  Omit<IChat, 'participants' | 'lastMessage'>
>;

export interface ISummaryMessage {
  summary: string;
  originalMessageId: string;
  originalLength: string;
}

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
  content: string;
  type: 'text';
  isRead: boolean;
  createdAt: string;
  isPinned: boolean;
  sender: IParticipant;
  chat: IMessageChat;
  filePath: string | null;
  fileType: string | null;
  fileSize: null | number;
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

export interface IContextMenu {
  isVisible: boolean;
  x: number;
  y: number;
}

export interface IMessageWithFileBody {
  content: string;
  chatId: string;
  file: File;
}
