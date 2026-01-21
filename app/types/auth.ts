import type {ResponseBody} from './index'


export interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatarUrl?: string,
}

export type CheckExist = ResponseBody<{exists: boolean}>

export interface CheckExistBody {
    email: string
}
export type AuthStep = "email" | "login" | "register"

export type LoginRes = ResponseBody<User> & {token: string}
export interface LoginBody {
    email: string,
    password: string
}

export type RegisterRes = ResponseBody<User & {token: string}>
export interface RegisterBody extends LoginBody {
    username: string
}

export type AuthMe = ResponseBody<User>
