import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

export const app = express();
export const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
