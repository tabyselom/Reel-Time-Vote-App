import { NextFunction, Request, Response } from "express";
import constants from "./constants";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  switch (statusCode) {
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stack: err.stack,
      });
      break;
    case constants.BAD_REQUEST:
      res.json({
        title: "Bad Request",
        message: err.message,
        stack: err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stack: err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stack: err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message,
        stack: err.stack,
      });
      break;
    default:
      res.json({
        title: "Error",
        message: err.message,
        stack: err.stack,
      });
      break;
  }
};
export default errorHandler;
