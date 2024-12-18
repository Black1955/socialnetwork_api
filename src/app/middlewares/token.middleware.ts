import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';
import { ApiError } from '../services/ErrorService.js';
import { NextFunction, Response, Request } from 'express';
import { TOKEN } from '../../configs/checkENV.js';
export default function tokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //@ts-ignore
    const token = req.headers.authorization;
    if (!token) {
      return next(ApiError.UnautorizedError());
    }
    const user = jsonwebtoken.verify(token, TOKEN!);
    //@ts-ignore
    req.user = user;
    next();
  } catch (error) {
    return next(ApiError.UnautorizedError());
  }
}
