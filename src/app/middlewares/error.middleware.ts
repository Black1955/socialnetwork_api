import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../services/ErrorService.js';
export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    return res
      .status(error.status)
      .json({ massage: error.message, errors: error.errors });
  }
  return res.status(500).json({ massage: 'server error' });
};
