import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { generateToken } from "../lib/utility";
import bcrypt from "bcryptjs";
import { user } from "../types/user.type";

const prisma = new PrismaClient();

export const signup = async (req: Request<{}, {}, user>, res: Response) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
    } else {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: "Email already exists" });
      } else {
        const hashedPassword = bcrypt.hashSync(
          password,
          bcrypt.genSaltSync(10)
        );

        const newUser = await prisma.user.create({
          data: {
            name: fullname.trim(),
            email,
            password: hashedPassword,
          },
        });
        generateToken(newUser.id, res);
        res.status(201).json({ message: "User signed up successfully" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
    }
    const user = await prisma.user.findUnique({ where: { email: email } });
    const isPasswordValid = user && bcrypt.compareSync(password, user.password);

    if (!user || !isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      generateToken(user.id, res);
      res.status(200).json({ message: "User logged in successfully" });
    }
    console.log("User ID:", req.user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" + error });
  }
};
