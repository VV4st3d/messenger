import type { TResponseBody } from './base-body';

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

export type TSearchFriendsResponse = TResponseBody<IFoundUser[]>;
export type TFriendRequestResponse = TResponseBody<IFriendResponse>;
export type TRequestsOutgoingResponse = TResponseBody<IFriendOutgoing[]>;
export type TRequestsIncomingResponse = TResponseBody<IFriendIncoming[]>;
export type TFriendRequestActionResponse = TResponseBody<IActionResponse>;

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

export interface IFriendOutgoing {
  id: string;
  status: TRequestStatus;
  createdAt: string;
  updatedAt: string;
  toUser: IFriend;
}

export interface IFriendIncoming {
  id: string;
  status: TRequestStatus;
  createdAt: string;
  updatedAt: string;
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

export type TFriendsResponse = TResponseBody<IFriend[]>;
