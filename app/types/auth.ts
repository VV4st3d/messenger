import type {ResponseBody} from './index'
import type { User } from './user'

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