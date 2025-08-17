"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protectedRoute = (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.token) {
            res.status(401).json({ error: "Unauthorized" });
        }
        else {
            const decoded = jsonwebtoken_1.default.verify(req.cookies.token, `${process.env.JWT_SECRET_KEY}`);
            if (!decoded || typeof decoded === "string") {
                res.status(401).json({ error: "Unauthorized" });
            }
            else {
                req.user = decoded.userId; // Assuming decoded contains user
                next();
            }
        }
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};
exports.protectedRoute = protectedRoute;
