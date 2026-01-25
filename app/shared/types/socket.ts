export interface UserStatus {
  userId: string;
  online: boolean;
  lastActive: string;
}

export type TSocketPayload<T extends keyof IPayload> = IPayload[T];

interface IPayload {
  userStatus: null;
  disconnect: null;
  connect: null;
  joinChat: string;
  newMessage: null;
  sendMessage: { chatId: string; content: string; type: 'text' };
}
