import {
  defineNuxtPlugin,
  useAuthStore,
  useCurrentChatStore,
  useRuntimeConfig,
} from '#imports';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { shallowRef } from 'vue';
import { SOCKET_EVENTS } from '~/shared/const';
import type { IMessage, TSocketPayload, UserStatus } from '~/shared/types';

const socketInstance = shallowRef<Socket | null>(null);
let connectPromise: Promise<Socket> | null = null;

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const currentChatStore = useCurrentChatStore();
  const config = useRuntimeConfig();

  const socketManager = {
    connect(): Promise<Socket> {
      if (socketInstance.value?.connected) {
        return Promise.resolve(socketInstance.value);
      }
      if (connectPromise) {
        return connectPromise;
      }

      connectPromise = new Promise((res, _rej) => {
        const token = authStore.token;
        if (!token) return;

        const socketConn = io(config.public.socketUrl, {
          auth: { token },
          reconnection: true,
          reconnectionAttempts: 5,
        });

        socketConn.on(SOCKET_EVENTS.CONNECT, () => {
          console.log('Socket Connected ID:', socketConn.id);
          socketInstance.value = socketConn;
          connectPromise = null;
          res(socketConn);
        });

        socketConn.on(SOCKET_EVENTS.USER_STATUS, (data: UserStatus) => {
          authStore.setOnline(data.online);
        });

        socketConn.on(SOCKET_EVENTS.DISCONNECT, () => {
          console.log('disconnected');
        });

        socketConn.on(SOCKET_EVENTS.NEW_MESSAGE, (data: IMessage) => {
          currentChatStore.pushMessage(data);
        });
      });
      return connectPromise;
    },

    disconnect() {
      if (socketInstance.value) {
        socketInstance.value.disconnect();
        socketInstance.value = null;
      }
    },

    emit<T extends SOCKET_EVENTS>(event: T, data: TSocketPayload<T>) {
      if (!socketInstance.value?.connected) {
        console.warn(`Socket not connected. Cannot emit ${event}`);
        return;
      }
      socketInstance.value.emit(event, data);
    },

    off(event: SOCKET_EVENTS) {
      socketInstance.value?.off(event);
    },
  };

  return {
    provide: {
      socket: socketManager,
    },
  };
});
