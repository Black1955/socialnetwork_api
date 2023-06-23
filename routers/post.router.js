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
postRouter.get("/like", tokenMiddleware, PostContorller.likePost);
postRouter.get("/dislike", tokenMiddleware, PostContorller.dislikePost);
postRouter.post(
  "/upload",
  tokenMiddleware,
  upload.fields([{ name: "avatar" }, { name: "background" }]),
  PostContorller.upload
);
