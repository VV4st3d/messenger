export interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatarUrl?: string,
  status?: 'offline' | 'online'
  isOnline?: boolean,
  createdAt?: string
}