import type { IResponseBody } from './base-body';

export type TSearchFriendsResponse = IResponseBody<IFoundUser[]>;
export type TFriendRequestResponse = IResponseBody<IFriendResponse>;
export type TRequestsOutgoingResponse = IResponseBody<IFriendOutgoing[]>;
export type TRequestsIncomingResponse = IResponseBody<IFriendIncoming[]>;
export type TFriendRequestActionResponse = IResponseBody<IActionResponse>;
export type TFriendsResponse = IResponseBody<IFriend[]>;

export interface IFriend {
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

export interface ICancelRequestResponse {
  success: boolean;
  message: string;
}

export interface IRemoveFriendResponse {
  success: boolean;
  removedFriendId: string;
  message: string;
}

export interface IActionResponse {
  id: string;
  status: TRequestStatus;
  createdAt: string;
  updatedAt: string;
  toUser: IFriend;
  fromUser: IFriend;
}

interface IFriendUnionBody {
  id: string;
  status: TRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IFriendOutgoing extends IFriendUnionBody {
  toUser: IFriend;
}

export interface IFriendIncoming extends IFriendUnionBody {
  fromUser: IFriend;
}

export interface IFriendResponse {
  status: TRequestStatus;
  fromUser: { id: string };
  toUser: { id: string };
  updatedAt: null | string;
  id: string;
  createAt: string | null;
}

export interface IFoundUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  status: string;
  isOnline: boolean;
  isFriend: boolean;
}

type TRequestStatus = 'pending' | 'accepted' | 'rejected';
