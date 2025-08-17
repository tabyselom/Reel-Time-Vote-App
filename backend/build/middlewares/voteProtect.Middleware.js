"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVotePollProtection = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Handle case where the user/IP has already voted
 */
const handleAlreadyVoted = async (pollId, hasVoted, next, res) => {
    if (hasVoted) {
        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: { Option: true }, // ✅ correct plural relation
        });
        if (!poll) {
            res.status(404).json({ message: "Poll not found" });
        }
        // Total vote count
        const totalCount = poll?.Option.reduce((sum, opt) => sum + (opt.vote_count ?? 0), // ✅ use snake_case
        0);
        res
            .status(200)
            .json({ message: "You have already voted", poll, totalCount });
    }
    else {
        next();
    }
};
/**
 * Middleware to protect poll voting routes
 */
const checkVotePollProtection = async (req, res, next) => {
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
                const decoded = jsonwebtoken_1.default.verify(req.cookies.token, `${process.env.JWT_SECRET_KEY}`);
                userId = decoded.userId;
            }
            catch (err) {
                console.warn("Invalid token:", err);
            }
        }
        // Check if the user/IP has voted
        let hasVoted;
        if (userId) {
            hasVoted = await prisma.vote.findFirst({
                where: {
                    pollId: pollId, // ✅ correct
                    OR: [
                        { userId: userId }, // ✅ correct
                        { voter_ip: ip }, // stays snake_case because your field in the schema is exactly `voter_ip`
                    ],
                },
            });
        }
        else {
            hasVoted = await prisma.vote.findFirst({
                where: {
                    pollId: pollId,
                    voter_ip: ip,
                },
            });
        }
        await handleAlreadyVoted(pollId, hasVoted, next, res);
    }
    catch (error) {
        console.error("Vote protection error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.checkVotePollProtection = checkVotePollProtection;
