import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Handle case where the user/IP has already voted
 */
const handleAlreadyVoted = async (
  pollId: string,
  hasVoted: any,
  next: NextFunction,
  res: Response
) => {
  if (hasVoted) {
    const poll = await prisma.polls.findUnique({
      where: { id: pollId },
      include: { options: true }, // ✅ correct plural relation
    });

    if (!poll) {
      res.status(404).json({ message: "Poll not found" });
    }

    // Total votes count
    const totalCount: number = poll?.options.reduce(
      (sum: any, opt: any) => sum + (opt.votes_count ?? 0), // ✅ use snake_case
      0
    );

    res
      .status(200)
      .json({ message: "You have already voted", poll, totalCount });
  } else {
    next();
  }
};

/**
 * Middleware to protect poll voting routes
 */
export const checkVotePollProtection = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id: pollId } = req.params;
  const ip = req.socket.remoteAddress;

  if (!pollId || pollId.length <= 12) {
    res.status(400).json({ status: "error", message: "Poll ID is required." });
  }

  if (!ip) {
    res
      .status(401)
      .json({ status: "error", message: "Unable to detect client IP." });
  }

  try {
    let userId = "";

    // Decode token if present
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

    // Check if the user/IP has voted
    let hasVoted;

    if (userId) {
      hasVoted = await prisma.votes.findFirst({
        where: {
          pollId: pollId, // ✅ correct
          OR: [
            { userId: userId }, // ✅ correct
            { voter_ip: ip }, // stays snake_case because your field in the schema is exactly `voter_ip`
          ],
        },
      });
    } else {
      hasVoted = await prisma.votes.findFirst({
        where: {
          pollId: pollId,
          voter_ip: ip,
        },
      });
    }

    await handleAlreadyVoted(pollId, hasVoted, next, res);
  } catch (error) {
    console.error("Vote protection error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
