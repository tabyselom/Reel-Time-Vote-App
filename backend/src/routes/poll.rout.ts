import { Router } from "express";

export const pollRouter = Router();
import { protectedRoute } from "../middlewares/protectedRout.Middleware";

import {
  createPoll,
  getMyPolls,
  getPollById,
  votePoll,
} from "../controllers/poll.controller";
import { checkVotePollProtection } from "../middlewares/voteProtect.Middleware";

pollRouter.post("/create", protectedRoute, createPoll);
pollRouter.get("/my-polls", protectedRoute, getMyPolls);

pollRouter.get("/:id", checkVotePollProtection, getPollById);
pollRouter.put("/vote/:id", votePoll);
