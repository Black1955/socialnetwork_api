import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
import { ApiError } from "../services/error.service.js";
export default function tokenMiddleware(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.clearCookie("token", { secure: true });
      // res.json({ access: false, massage: "unvalid token" });
      return next(ApiError.UnautorizedError());
    }
    const user = jsonwebtoken.verify(token, process.env.FRASE);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("token", { secure: true });
    return next(ApiError.UnautorizedError());
  }
}
