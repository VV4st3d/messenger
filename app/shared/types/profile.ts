import type { IResponseBody } from './base-body';

export interface IProfile {
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
  isOwnProfile: boolean;
  bio: string | null;
  friendRequestStatus: TFriendRequestStatus;
  friendRequestId: string | null;
}

export type TFriendRequestStatus = 'sent' | 'received' | 'none' | 'friends';

export type TProfile = IResponseBody<IProfile>;
