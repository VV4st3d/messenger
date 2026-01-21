import { io, Socket } from "socket.io-client";

export default defineNuxtPlugin(() => {
    const socketInstance = shallowRef<Socket | null>(null);
    const authStore = useAuthStore();
    const config = useRuntimeConfig();

    const socketManager = {
        connect() {
            if (socketInstance.value?.connected) return;

            const token = authStore.token;
            if (!token) return;

            const s = io(config.public.socketUrl, {
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
            });

            s.on("connect", () => {
                console.log("Socket Connected ID:", s.id);
            });

            s.on("userStatus", (data) => {
                authStore.setOnline(data.online);
            });

            s.on("disconnect", () => {
                console.log('disconnected');
            });

            socketInstance.value = s;
        },

        disconnect() {
            if (socketInstance.value) {
                socketInstance.value.disconnect(); 
                socketInstance.value = null; 
            }
        },

        emit(event: string, data: any) {
            if (!socketInstance.value?.connected) {
                console.warn(`Socket not connected. Cannot emit ${event}`);
                return;
            }
            socketInstance.value.emit(event, data);
        },

        on(event: string, callback: (data: any) => void) {
            socketInstance.value?.on(event, callback);
        },

        off(event: string) {
            socketInstance.value?.off(event);
        }
    };

    return {
        provide: {
            socket: socketManager,
        },
    };
});
