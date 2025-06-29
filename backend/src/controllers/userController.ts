import { Request, Response } from "express";
import { CreateUserBody } from "../types/userTypes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/user/create
export const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response
) => {
  if (await prisma.users.findUnique({ where: { email: req.body.email } })) {
    res.status(400).json({ error: "Email already exists" });
  } else {
    try {
      const userData = req.body;
      const newUser = await prisma.users.create({ data: userData });
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
    }
    const user = await prisma.users.findUnique({
      where: { email: email, password: password },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({
        message: "Login successful",
        userId: user.id,
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
