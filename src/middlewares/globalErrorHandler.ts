import { Request, Response } from "express";
import { config } from "../configs/config.js";
import { ErrorHandler } from "../utils/utility-classes.js";

export const globalErrorHandler = (err: ErrorHandler, req: Request, res: Response) => {
  const statusCode = (err.statusCode ||= 500);
  const errorMessage = (err.message ||= "Something went wrong global error handler") as string;

  return res.status(statusCode).json({
    message: errorMessage,
    errorStack: config.env === "development" ? err.stack : "",
  });
};
