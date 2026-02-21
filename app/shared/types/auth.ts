import type { IResponseBody } from './base-body';

export interface IUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export type TCheckExist = IResponseBody<{ exists: boolean }>;

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

export type TUserInitRes = IResponseBody<IUser>;

export type TAuthenticationRes = IResponseBody<IUser> & { token: string };
