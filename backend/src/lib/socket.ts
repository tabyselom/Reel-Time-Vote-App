import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

export const app = express();
export const server = createServer(app);
app.use(express.json());

export const io = new Server(server, {
  cors: {
    origin: [process.env.ORIGIN || ""],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});
