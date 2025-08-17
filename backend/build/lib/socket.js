"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.server = (0, http_1.createServer)(exports.app);
exports.app.use(express_1.default.json());
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: [process.env.ORIGIN || ""],
    },
});
exports.io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
});
