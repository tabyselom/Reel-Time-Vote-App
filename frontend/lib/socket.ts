import io from "socket.io-client";

export const socket = io(process.env.VITE_BACKEND_URL as string, {});
