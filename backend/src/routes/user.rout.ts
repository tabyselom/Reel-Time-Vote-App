import { Router } from "express";
import { getMe, login, logout, signup } from "../controllers/user.controller";
import { protectedRoute } from "../middlewares/protectedRout.Middleware";

export const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.get("/logout", protectedRoute, logout);
userRouter.get("/", protectedRoute, getMe);
