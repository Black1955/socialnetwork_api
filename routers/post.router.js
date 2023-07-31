import { Router } from "express";
import PostContorller from "../controllers/post.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import { upload } from "../middlewares/file.middleware.js";
export const postRouter = Router();
postRouter.get("/", tokenMiddleware, PostContorller.getUserPosts);
postRouter.post(
  "/create",
  upload.single("post"),
  tokenMiddleware,
  PostContorller.CreateuserPost
);
postRouter.get(
  "/recomendposts/:id",
  tokenMiddleware,
  PostContorller.getRecomendedPosts
);
postRouter.post("/like", tokenMiddleware, PostContorller.likePost);
postRouter.post("/dislike", tokenMiddleware, PostContorller.dislikePost);
