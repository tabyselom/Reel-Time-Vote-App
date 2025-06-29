import { Router } from "express";
import { createUser, getUser } from "../controllers/userController";

const router = Router();

router.post("/create", createUser);
router.post("/login", getUser);

export default router;
