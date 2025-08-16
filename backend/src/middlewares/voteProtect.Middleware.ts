import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // adjust your import path accordingly

const something = async (
  pollId: string,
  hasVoted: any,
  next: NextFunction,
  res: Response
) => {
  if (hasVoted) {
    const poll = await prisma.polls.findUnique({
      where: { id: pollId },
      include: { options: true },
    });
    if (!poll) {
      res.status(404).json({ message: "Poll not found" });
    } else {
      interface Option {
        id: string;
        text: string;
        votesCount?: number;
        // add other fields if needed
      }

      interface Poll {
        id: string;
        Option: Option[];
        // add other fields if needed
      }

      const pollTyped = poll as Poll;
      const totalCount: number = pollTyped.Option.reduce(
        (sum: number, opt: Option) => sum + (opt.votesCount ?? 0),
        0
      );
      res
        .status(200)
        .json({ message: "You have already voted", poll, totalCount });
    }
  } else {
    next();
  }
};

export const checkVotePollProtection = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id: pollId } = req.params;
  const ip = req.socket.remoteAddress;

  if (!pollId || pollId.length <= 12) {
    res.status(400).json({ status: "error", message: "Poll ID is required." });
    return;
  }
  if (!ip) {
    res
      .status(401)
      .json({ status: "error", message: "Unable to detect client IP." });
    return;
  }

  try {
    let userId = "";

    if (req.cookies.token) {
      try {
        const decoded = jwt.verify(
          req.cookies.token,
          `${process.env.JWT_SECRET_KEY}`
        ) as { userId: string };

        userId = decoded.userId;
      } catch (err) {
        console.warn("Invalid token:", err);
      }
    }

    if (userId) {
      const hasVoted = await prisma.votes.findFirst({
        where: {
          poll_id: pollId,
          OR: [{ user_id: userId }, { voter_ip: ip }],
        },
      });
      something(pollId, hasVoted, next, res);
    } else {
      console.log(pollId);
      const hasVoted = await prisma.votes.findFirst({
        where: { poll_id: pollId, voter_ip: ip },
      });

      something(pollId, hasVoted, next, res);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
