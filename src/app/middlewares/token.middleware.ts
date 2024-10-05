import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';
import { ApiError } from '../services/error.service.js';
import { NextFunction, Response } from 'express';
export default function tokenMiddleware(
  req: Response,
  res: Request,
  next: NextFunction
) {
  try {
    //@ts-ignore
    const token = req.headers.authorization;
    if (!token) {
      return next(ApiError.UnautorizedError());
    }
    const user = jsonwebtoken.verify(token, process.env.FRASE!);
    //@ts-ignore
    req.user = user;
    next();
  } catch (error) {
    return next(ApiError.UnautorizedError());
  }
}
