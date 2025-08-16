import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const createPoll = async (req: Request, res: Response) => {
  const { question, options } = req.body;
  const userId = req.user;

  if (!question || !options) {
    res.status(400).json({ message: "Please provide question and options" });
  } else {
    try {
      if (!Array.isArray(options) || options.length < 2) {
        res
          .status(400)
          .json({ message: "Options must be with at least two items" });
      } else {
        const newPoll = await prisma.polls.create({
          data: { question, userId },
        });

        const newOptions = await Promise.all(
          options.map((option) =>
            prisma.options.create({
              data: {
                pollId: newPoll.id,
                text: option,
              },
            })
          )
        );
        res.status(201).json({
          id: newPoll.id,
          poll: newPoll,
          options: newOptions,
        });
      }

      // Logic to create a poll
    } catch (error) {
      res.status(500).json({ error: "Failed to create poll" });
    }
  }
};

export const getMyPolls = async (req: Request, res: Response) => {
  const userId = req.user;

  try {
    const polls = await prisma.polls.findMany({
      where: { userId },
      include: { Option: true },
    });

    if (polls.length === 0) {
      res.status(404).json({ message: "No polls found" });
    } else {
      res.status(200).json(polls);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch polls" });
  }
};

export const getPollById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id: pollId } = req.params;
  try {
    const poll = await prisma.polls.findUnique({
      where: { id: pollId },
      include: { Option: true },
    });
    if (!poll) {
      res.status(404).json({ message: "Poll not found" });
    } else {
      res.status(200).json(poll);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch poll" });
  }
};

// export const checkPollForVote = async (
//   req: Request<{ id: string }>,
//   res: Response
// ) => {
//   try {
//     let userId = "";

//     if (req.cookies.token) {
//       try {
//         const decoded = jwt.verify(
//           req.cookies.token,
//           `${process.env.JWT_SECRET_KEY}`
//         ) as { userId: string };

//         userId = decoded.userId;
//       } catch (err) {
//         console.warn("Invalid token:", err);
//       }
//     }

//     const { id: pollId } = req.params;
//     let ip = req.socket.remoteAddress;

//     if (!pollId) {
//       res.status(400).json({ message: "Poll ID is required." });
//     }

//     if (!ip) {
//       res.status(401).json({ message: "Unable to detect client IP." });
//     }

//     if (userId) {
//       const hasVoted = await prisma.votes.findFirst({
//         where: {
//           pollId,
//           OR: [{ userId }, { voter_ip: ip }],
//         },
//       });
//       if (hasVoted) {
//         res.status(200).json({ message: "You have already voted" });
//       }
//     } else {
//       const hasVoted = await prisma.votes.findFirst({
//         where: { pollId, voter_ip: ip },
//       });
//       if (hasVoted) {
//         const { voter_ip, voted_at, ...data } = hasVoted;
//         res.status(200).json({ message: "You have already voted", data });
//       } else {
//         res.status(200).json(res);
//       }
//     }
//   } catch (error) {
//     console.error("Vote protection error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const votePoll = async (req: Request<{ id: string }>, res: Response) => {
  let userId = "";
  if (req.cookies.token) {
    const decoded = jwt.verify(
      req.cookies.token,
      `${process.env.JWT_SECRET_KEY}`
    );
    userId =
      typeof decoded === "object" && "userId" in decoded
        ? (decoded as any).userId
        : "";
  }

  try {
    const { id: optionId } = req.params;
    const ip: string = req.connection.remoteAddress || "";

    // option exists
    const option = await prisma.options.findUnique({
      where: { id: optionId },
    });
    if (userId) {
      const hasVoted = await prisma.votes.findFirst({
        where: {
          pollId: option?.pollId,
          OR: [{ userId }, { voter_ip: ip }],
        },
      });
      if (hasVoted) {
        const { voter_ip, voted_at, ...data } = hasVoted;
        res.status(200).json({ message: "You have already voted", data });
      }
    } else {
      const hasVoted = await prisma.votes.findFirst({
        where: { pollId: option?.pollId, voter_ip: ip },
      });
      if (hasVoted) {
        const { voter_ip, voted_at, ...data } = hasVoted;

        res.status(200).json({ message: "You have already voted", data });
      }
    }

    if (!option) {
      res.status(400).json({ message: "Invalid option selected" });
    } else {
      // Record the vote
      if (userId) {
        await prisma.votes.create({
          data: {
            userId,
            pollId: option.pollId,
            optionId,
            voter_ip: ip,
          },
        });
      } else {
        await prisma.votes.create({
          data: {
            pollId: option.pollId,
            optionId,
            voter_ip: ip,
          },
        });
      }

      await prisma.options.update({
        where: { id: optionId },
        data: {
          votesCount: { increment: 1 },
        },
      });

      res.status(200).json({ message: "Vote recorded successfully" });
    }

    // Check if the user or IP has already voted in this poll
  } catch (error) {
    console.error("Error recording vote:", error);
    res.status(500).json({ error: "Failed to record vote" });
  }
};
