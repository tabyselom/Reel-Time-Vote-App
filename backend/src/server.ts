import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { userRouter } from "./routes/user.rout";
import { pollRouter } from "./routes/poll.rout";
import { app, server } from "./lib/socket";

config();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use("/api/auth", userRouter);
app.use("/api/poll", pollRouter);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
