"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_rout_1 = require("./routes/user.rout");
const poll_rout_1 = require("./routes/poll.rout");
const socket_1 = require("./lib/socket");
(0, dotenv_1.config)();
const PORT = process.env.PORT || 500;
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use((0, cors_1.default)({
    origin: process.env.ORIGIN,
    credentials: true,
}));
socket_1.app.use("/api/auth", user_rout_1.userRouter);
socket_1.app.use("/api/poll", poll_rout_1.pollRouter);
socket_1.server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
