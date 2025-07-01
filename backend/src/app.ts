import express from "express";
import dotenv from "dotenv";
import userRouter from "./router/userRouter";
import pollRouter from "./router/pollrouter";
import errorHandler from "./middleware/errorHandler";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

// Routes
app.locals.io = io;
app.use("/api/user", userRouter);
app.use("/api/poll", pollRouter);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
