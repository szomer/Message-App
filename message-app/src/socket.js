import { io } from 'socket.io-client';

export const socket = io('http://localhost:3001', {
  autoConnect: false
});

socket.onAny((event, ...args) => {
  console.log('EVENT -', event, args);
});