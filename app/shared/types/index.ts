export type { IFriend, TFriends } from './friends';
export type {
  IUser,
  ILoginBody,
  IRegisterBody,
  TUserInitRes,
  TCheckExist,
  TCheckExistBody,
  TAuthenticationRes,
} from './auth';
export type {
  UserStatus,
  TSocketEmitPayload,
  TSocketOnPayload,
  TSOCKET_EMIT_EVENTS,
  TSOCKET_ON_EVENTS,
  ITyping,
} from './socket';
export type {
  TChat,
  TChats,
  IChat,
  IParticipant,
  TMessages,
  IMessage,
  IMessageBody,
  TSendMessageResponse,
} from './chat';

export type { valueOf } from './helpers';
