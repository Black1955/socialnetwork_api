import { Router } from "express";
import userController from "../controllers/user.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import { upload } from "../middlewares/file.middleware.js";
export const userRouter = Router();

userRouter.post("/signin", userController.signin);
userRouter.post("/signup", userController.signup);
userRouter.get("/getuser/:nickname", tokenMiddleware, userController.getUser);
userRouter.post("/subscribe", tokenMiddleware, userController.SubscribeUser);
userRouter.post(
  "/unsubscribe",
  tokenMiddleware,
  userController.unSubscribeUser
);
userRouter.post(
  "/setavatar",
  tokenMiddleware,
  upload.single("avatar"),
  userController.setAvatar
);
userRouter.post(
  "/setback",
  tokenMiddleware,
  upload.single("background"),
  userController.setBackFoto
);
userRouter.get("/search", tokenMiddleware, userController.searchUsers);
userRouter.put(
  "/updateprofile",
  tokenMiddleware,
  upload.fields([{ name: "avatar" }, { name: "background" }]),
  userController.updateProfile
);
