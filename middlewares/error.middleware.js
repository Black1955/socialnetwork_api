import { ApiError } from "../services/error.service.js";
export const errorMiddleware = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res
      .status(error.status)
      .json({ massage: error.message, errors: error.errors });
  }
  return res.status(500).json({ massage: "server error" });
};
