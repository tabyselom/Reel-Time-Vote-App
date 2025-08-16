import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { user } from "../types/user.type";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust type as needed
    }
  }
}

export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      const decoded = jwt.verify(
        req.cookies.token,
        `${process.env.JWT_SECRET_KEY}`
      );
      if (!decoded || typeof decoded === "string") {
        res.status(401).json({ error: "Unauthorized" });
      } else {
        req.user = decoded.userId; // Assuming decoded contains user
        next();
      }
    }
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
