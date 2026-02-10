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
export type TFriendRequestResponse = TResponseBody<IFriendRequest>;

export interface IFriendRequest {
  status: 'pending' | 'accepted' | 'rejected';
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

export type TFriendsResponse = TResponseBody<IFriend[]>;
