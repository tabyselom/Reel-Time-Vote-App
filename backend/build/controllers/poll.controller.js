"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.votePoll = exports.getPollById = exports.getMyPolls = exports.createPoll = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// Create a new poll
const createPoll = async (req, res) => {
    const { question, options } = req.body;
    const userId = req.user; // make sure you set req.user somewhere in auth middleware
    if (!question || !options) {
        res.status(400).json({ message: "Please provide question and options" });
    }
    if (!Array.isArray(options) || options.length < 2) {
        res.status(400).json({ message: "Options must have at least two items" });
    }
    try {
        const newPoll = await prisma.poll.create({
            data: { question, userId: userId },
        });
        const newOptions = await Promise.all(options.map((option) => prisma.option.create({
            data: {
                pollId: newPoll.id,
                text: option,
            },
        })));
        res.status(201).json({
            id: newPoll.id,
            poll: newPoll,
            options: newOptions,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create poll" });
    }
};
exports.createPoll = createPoll;
// Get polls created by the current user
const getMyPolls = async (req, res) => {
    const userId = req.user;
    try {
        const polls = await prisma.poll.findMany({
            where: { userId: userId },
            include: { Option: true },
        });
        if (polls.length === 0) {
            res.status(404).json({ message: "No polls found" });
        }
        res.status(200).json(polls);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch polls" });
    }
};
exports.getMyPolls = getMyPolls;
// Get poll by ID
const getPollById = async (req, res) => {
    const { id: pollId } = req.params;
    try {
        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: { Option: true },
        });
        if (!poll) {
            res.status(404).json({ message: "Poll not found" });
        }
        res.status(200).json(poll);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch poll" });
    }
};
exports.getPollById = getPollById;
// Vote on a poll option
const votePoll = async (req, res) => {
    let userId = "";
    if (req.cookies.token) {
        const decoded = jsonwebtoken_1.default.verify(req.cookies.token, `${process.env.JWT_SECRET_KEY}`);
        userId =
            typeof decoded === "object" && "userId" in decoded
                ? decoded.userId
                : "";
    }
    try {
        const { id: optionId } = req.params;
        const ip = req.connection.remoteAddress || "";
        // Option exists
        const option = await prisma.option.findUnique({ where: { id: optionId } });
        if (!option) {
            res.status(400).json({ message: "Invalid option selected" });
        }
        // Check if user or IP has already voted
        if (!option) {
            res.status(400).json({ message: "Invalid option selected" });
        }
        const whereClause = userId
            ? {
                pollId: option?.pollId, // ✅ now guaranteed to exist
                OR: [{ user_id: userId }, { voter_ip: ip }],
            }
            : {
                pollId: option?.pollId,
                voter_ip: ip,
            };
        const hasVoted = await prisma.vote.findFirst({ where: whereClause });
        if (hasVoted) {
            const { voter_ip, voted_at, ...data } = hasVoted;
            res.status(200).json({ message: "You have already voted", data });
        }
        // Record the vote
        await prisma.vote.create({
            data: {
                pollId: option?.pollId,
                optionId: optionId,
                voter_ip: ip,
                ...(userId && { user_id: userId }),
            },
        });
        // Increment the vote count
        await prisma.option.update({
            where: { id: optionId },
            data: { votesCount: { increment: 1 } },
        });
        res.status(200).json({ message: "Vote recorded successfully" });
    }
    catch (error) {
        console.error("Error recording vote:", error);
        res.status(500).json({ error: "Failed to record vote" });
    }
};
exports.votePoll = votePoll;
