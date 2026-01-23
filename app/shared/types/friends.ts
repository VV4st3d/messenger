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

export type TFriends = TResponseBody<IFriend[]>;
