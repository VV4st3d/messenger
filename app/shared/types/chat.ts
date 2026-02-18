import type { TResponseBody } from './base-body';

export type TChats = TResponseBody<IChat[]>;
export type TChat = TResponseBody<Omit<IChat, 'lastMessage'>>;
export type TMessegesResponse = TResponseBody<{
  messages: IMessage[];
  hasMoreTop: boolean;
  hasMoreBottom: boolean;
  direction: 'initial';
}>;
export type TMessengesFindResponse = TResponseBody<IMessage[]>;

export type TPinnedMessagesResponse = TResponseBody<IMessage[]>;
export type TMessageResponse = TResponseBody<IMessage>;

export type TSummaryMessage = TResponseBody<ISummaryMessage>;

export type TMessagesListById = TResponseBody<IFoundMessageData>;
export type TChatInfo = TResponseBody<
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
  message: IMessage | null;
}

export interface IMessageWithFileBody {
  content: string;
  chatId: string;
  file: File;
}
