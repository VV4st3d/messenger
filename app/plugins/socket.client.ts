import { io } from 'socket.io-client';

export default defineNuxtPlugin(() => {
  const socket = io(useRuntimeConfig().public.socketUrl);
  console.log(socket)
  return { provide: { socket } };
});

