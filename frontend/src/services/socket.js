import { io } from "socket.io-client";

// Connect to current origin so the Vite proxy forwards /socket.io → port 5000.
// autoConnect: false so listeners are registered before the handshake fires,
// eliminating the race where tasks:sync arrives before useTasks can hear it.
export const socket = io(import.meta.env.VITE_SOCKET_URL ?? "", {
  autoConnect: false,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});