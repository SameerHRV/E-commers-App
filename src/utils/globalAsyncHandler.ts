import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

export const globalAsyncHandler = (
  requireHandler: (err: HttpError, req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requireHandler(err, req, res, next)).catch((error) => {
      next(error);
    });
  };
};
