import type { TResponseBody } from '../../types/base-body';

export interface IUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export type TCheckExist = TResponseBody<{ exists: boolean }>;

export interface TCheckExistBody {
  email: string;
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IRegisterBody extends ILoginBody {
  username: string;
}

export type TUserInitRes = TResponseBody<IUser>;

export type TAuthenticationRes = TResponseBody<IUser> & { token: string };
