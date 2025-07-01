import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { PollBody } from "../types/pollTypes";

const prisma = new PrismaClient();

const listPoll = async (req: Request, res: Response) => {
  try {
    const myPolls = await prisma.polls.findMany({
      where: { user_id: req.query.userId as string },
      include: { options: true },
    });
    if (myPolls.length === 0) {
      res.status(404).json({ error: "No polls found" });
    }

    res.status(200).json(myPolls);
  } catch (error) {
    console.error("Error fetching poll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createPoll = async (req: Request<{}, {}, PollBody>, res: Response) => {
  const pollData = req.body;
  const io = req.app.locals.io;

  // Validate
  if (
    !pollData.question ||
    !pollData.userId ||
    !Array.isArray(pollData.options) ||
    pollData.options.length < 2
  ) {
    res.status(400).json({
      error: "Poll must have a question, a user ID, and at least two options.",
    });
  }
  const invalidOptions = pollData.options.filter((opt) => !opt.trim());
  if (invalidOptions.length > 0) {
    res.status(400).json({ error: "Poll options cannot be empty." });
  }

  ///////////
  try {
    const newPoll = await prisma.polls.create({
      data: {
        question: pollData.question,
        user_id: pollData.userId,
      },
    });

    const createOptions = await Promise.all(
      pollData.options.map((option) =>
        prisma.options.create({
          data: {
            text: option,
            poll_id: newPoll.id,
          },
        })
      )
    );

   
    io.emit("pollCreated", { poll: newPoll, options: createOptions });

    res.status(201).json({ poll: newPoll, options: createOptions });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPoll = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const pollId = req.params.id;
    const poll = await prisma.polls.findUnique({
      where: { id: pollId },
      include: { options: true },
    });
    if (!poll) {
      res.status(404).json({ error: "Poll not found" });
    }
    res.status(200).json(poll);
  } catch (error) {
    console.error("Error fetching poll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePoll = async (
  req: Request<{ id: string }, {}, PollBody>,
  res: Response
) => {
  const pollId = req.params.id;
  const userId = String(req.query.userId);

  try {
    const pollData = await prisma.polls.findUnique({ where: { id: pollId } });
    if (!pollData) {
      res.status(404).json({ error: "Poll not found" });
      return;
    }

    if (String(pollData.user_id) !== userId)
      res.status(403).json({ error: "Unauthorized" });

    const updatedPoll = await prisma.polls.update({
      where: { id: pollId },
      data: { question: req.body.question },
    });

    res.status(200).json(updatedPoll);
  } catch (error) {
    console.error("Error updating poll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePoll = async (req: Request<{ id: string }>, res: Response) => {
  const pollId = req.params.id;
  const userId = String(req.query.userId);
  try {
    const pollData = await prisma.polls.findUnique({
      where: { id: pollId },
    });
    if (!pollData) {
      res.status(404).json({ error: "Poll not found" });
    } else if (String(pollData.user_id) !== String(userId)) {
      res
        .status(403)
        .json({ error: "You are not authorized to delete this poll" });
    }

    await prisma.polls.delete({
      where: { id: pollId },
    });
    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const incrementVotes = async (req: Request<{ id: string }>, res: Response) => {
  const optionId = req.params.id;
  const io = req.app.locals.io;

  try {
    const option = await prisma.options.findUnique({
      where: { id: optionId },
    });
    if (!option) {
      res.status(404).json({ error: "Option not found" });
      return;
    }

    const pollId = option.poll_id;
    const voteIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const existingVote = await prisma.votes.findFirst({
      where: {
        poll_id: pollId,
        voter_ip: String(voteIp),
      },
    });
    if (existingVote) {
      res.status(400).json({ error: "You have already voted for this option" });
    } else {
      const updatedOption = await prisma.options.update({
        where: { id: optionId },
        data: { votes_count: { increment: 1 } },
      });

      await prisma.votes.create({
        data: {
          poll_id: pollId,
          option_id: optionId,
          voter_ip: String(voteIp),
        },
      });

      const options = await prisma.options.findMany({
        where: { poll_id: updatedOption.poll_id },
      });
      io.emit("voteUpdate", {
        optionId,
        votes_count: updatedOption.votes_count,
      });
      io.emit("voteCountUpdated", {
        pollId: updatedOption.poll_id,
        options: options,
      });

      res.status(200).json(updatedOption);
    }
  } catch (error) {
    console.error("Error counting votes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  listPoll,
  createPoll,
  getPoll,
  updatePoll,
  deletePoll,
  incrementVotes,
};
