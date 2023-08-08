import { Router } from "express";
import userController from "../controllers/user.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

export const userRouter = Router();

userRouter.post("/signin", userController.signin);
userRouter.post("/signup", userController.signup);
userRouter.get("/refresh", tokenMiddleware, userController.refresch);
userRouter.get("/getuser/:id", tokenMiddleware, userController.getUser);
userRouter.post("/subscribe", tokenMiddleware, userController.SubscribeUser);
userRouter.post(
  "/unsubscribe",
  tokenMiddleware,
  userController.unSubscribeUser
);
userRouter.put("/setphoto", tokenMiddleware, userController.setPhoto);
userRouter.get("/search", tokenMiddleware, userController.searchUsers);
userRouter.put("/updateprofile", tokenMiddleware, userController.updateProfile);
userRouter.get(
  "/recomenduser/:userId",
  tokenMiddleware,
  userController.getRecomendUser
);
