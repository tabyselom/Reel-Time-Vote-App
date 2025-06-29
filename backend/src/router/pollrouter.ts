import express from "express";
const router = express.Router();
import {
  listPoll,
  createPoll,
  getPoll,
  updatePoll,
  deletePoll,
  incrementVotes,
} from "../controllers/pollController";

router.get("/get/:id", getPoll);

router.get("/list", listPoll);
router.post("/create", createPoll);
router.put("/edit/:id", updatePoll);
router.delete("/delete/:id", deletePoll);
router.post("/vote/:id", incrementVotes);

export default router;
