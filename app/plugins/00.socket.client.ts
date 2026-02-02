/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { useAuthStore } from '#imports';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { shallowRef } from 'vue';
import { SOCKET_ON_EVENTS } from '~/shared/const';
import type {
  TSocketEmitEvents,
  TSocketOnEvents,
  TSocketEmitPayload,
  TSocketOnPayload,
  UserStatus,
} from '~/shared/types';

export default defineNuxtPlugin({
  name: 'socket',
  setup(nuxtApp) {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const socketInstance = shallowRef<Socket | null>(null);

    const socketManager = {
      connect() {
        if (socketInstance.value?.connected) return;

        const socket: Socket = io(config.public.socketUrl, {
          auth: { token: authStore.token },
          autoConnect: true,
          transports: ['websocket'],
        });

        socket.on(SOCKET_ON_EVENTS.CONNECT, () => {
          socketInstance.value = socket;
          console.log('Socket connected');
        });

        socket.on(SOCKET_ON_EVENTS.USER_STATUS, async (payload: UserStatus) => {
          if (import.meta.client && nuxtApp.isHydrating) {
            await new Promise((resolve) => {
              nuxtApp.hooks.hook('app:suspense:resolve', resolve);
            });
          }
          authStore.setOnline(payload.online);
        });
      },

      on<T extends TSocketOnEvents>(
        event: T,
        callback: (data: TSocketOnPayload<T>) => void,
      ) {
        socketInstance.value?.on(event, callback as any);
      },

      emit<T extends TSocketEmitEvents>(event: T, data: TSocketEmitPayload<T>) {
        if (!socketInstance.value?.connected) {
          console.warn(`Socket not connected.`);
          return;
        }
        socketInstance.value.emit(event, data);
      },

      off(event: TSocketOnEvents) {
        socketInstance.value?.off(event);
      },

      disconnect() {
        socketInstance.value?.disconnect();
        socketInstance.value = null;
      },
    };

    return {
      provide: {
        socket: socketManager,
      },
    };
  },
});
