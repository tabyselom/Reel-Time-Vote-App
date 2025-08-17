"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const utility_1 = require("../lib/utility");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            res.status(400).json({ error: "All fields are required" });
        }
        else {
            const existingUser = await prisma.users.findUnique({ where: { email } });
            if (existingUser) {
                res.status(400).json({ error: "Email already exists" });
            }
            else {
                const hashedPassword = bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync(10));
                const newUser = await prisma.users.create({
                    data: {
                        name: fullname.trim(),
                        email,
                        password: hashedPassword,
                    },
                });
                (0, utility_1.generateToken)(newUser.id, res);
                res.status(201).json({ message: "User signed up successfully" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
        }
        const user = await prisma.users.findUnique({ where: { email: email } });
        const isPasswordValid = user && bcryptjs_1.default.compareSync(password, user.password);
        if (!user || !isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
        }
        else {
            (0, utility_1.generateToken)(user.id, res);
            res.status(200).json({ message: "User logged in successfully" });
        }
        console.log("User ID:", req.user);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const userId = req.user;
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" + error });
    }
};
exports.getMe = getMe;
