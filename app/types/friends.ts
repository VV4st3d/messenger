import type { ResponseBody } from ".";

export interface Friend {
  id: string
  username: string
  email: string
  passwordHash: string
  displayName: string
  lastActive: any
  avatarUrl: any
  status: string
  isOnline: boolean
  createdAt: string
  updatedAt: string
}

export type Friends = ResponseBody<Friend[]>

