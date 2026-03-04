import type { IResponseBody } from './base-body';

export interface IProfile {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  lastActive: string;
  avatarUrl: string | null;
  status: string;
  isOnline: boolean;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  isOwnProfile: boolean;
  bio: string | null;
  friendRequestStatus: TFriendRequestStatus;
  friendRequestId: string | null;
}

export type TFriendRequestStatus = 'sent' | 'received' | 'none' | 'friends';

export type TProfile = IResponseBody<IProfile>;
export type TUpdateProfileResponse = IResponseBody<IProfile> & {
  message: string;
};
export type TUploadPhotoResponse = IResponseBody<{ photoUrl: string }>;

export interface IEditProfileBody {
  bio?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: File | null;
}
