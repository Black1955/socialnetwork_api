import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
import { ApiError } from "../services/error.service.js";
export default function tokenMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(ApiError.UnautorizedError());
    }
    const user = jsonwebtoken.verify(token, process.env.FRASE);
    req.user = user;
    next();
  } catch (error) {
    return next(ApiError.UnautorizedError());
  }
}
