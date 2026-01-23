import { defineNuxtPlugin, useAuthStore, useRuntimeConfig } from '#imports';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { shallowRef } from 'vue';
import { SOCKET_EVENTS } from '~/shared/const';
import type { UserStatus } from '~/shared/types';

const socketInstance = shallowRef<Socket | null>(null);

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const socketManager = {
    connect() {
      if (socketInstance.value?.connected) return;

      const token = authStore.token;
      if (!token) return;

      const socketConn = io(config.public.socketUrl, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socketConn.on(SOCKET_EVENTS.CONNECT, () => {
        console.log('Socket Connected ID:', socketConn.id);
      });

      socketConn.on(SOCKET_EVENTS.USER_STATUS, (data) => {
        authStore.setOnline(data.online);
      });

      socketConn.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log('disconnected');
      });

      socketInstance.value = socketConn;
    },

    disconnect() {
      if (socketInstance.value) {
        socketInstance.value.disconnect();
        socketInstance.value = null;
      }
    },

    // emit(event: string, data: any) {
    //   if (!socketInstance.value?.connected) {
    //     console.warn(`Socket not connected. Cannot emit ${event}`);
    //     return;
    //   }
    //   socketInstance.value.emit(event, data);
    // },

    on(event: string, callback: (data: UserStatus) => void) {
      socketInstance.value?.on(event, callback);
    },

    off(event: string) {
      socketInstance.value?.off(event);
    },
  };

  return {
    provide: {
      socket: socketManager,
    },
  };
});
