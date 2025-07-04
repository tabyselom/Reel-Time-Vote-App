import dotenv from "dotenv";
import userRouter from "./router/userRouter";
import pollRouter from "./router/pollrouter";
import errorHandler from "./middleware/errorHandler";
import { app, server, io } from "./lib/socket";

import cors from "cors";

dotenv.config();

const PORT = process.env.PORT;

app.use(cors());

// Routes
app.locals.io = io;
app.use("/api/user", userRouter);
app.use("/api/poll", pollRouter);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
