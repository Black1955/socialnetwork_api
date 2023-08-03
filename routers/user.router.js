import { Router } from "express";
import userController from "../controllers/user.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import { upload } from "../middlewares/file.middleware.js";
import pool from "../db.js";
export const userRouter = Router();

userRouter.post("/signin", userController.signin);
userRouter.post("/signup", userController.signup);
userRouter.get("/refresh", tokenMiddleware, userController.refresch);
userRouter.get("/getuser/:id", tokenMiddleware, userController.getUser);
userRouter.post("/subscribe", tokenMiddleware, userController.SubscribeUser);
userRouter.get("/oleg", async (req, res) => {
  try {
    const oleg = await pool.query("select * from users");
    return res.json(oleg.rows);
  } catch (error) {
    return res.json(error);
  }
});
userRouter.post(
  "/unsubscribe",
  tokenMiddleware,
  userController.unSubscribeUser
);
userRouter.put(
  "/setphoto",
  tokenMiddleware,
  upload.fields([{ name: "avatar" }, { name: "background" }]),
  userController.setPhoto
);
userRouter.get("/search", tokenMiddleware, userController.searchUsers);
userRouter.put(
  "/updateprofile",
  tokenMiddleware,
  upload.fields([{ name: "avatar" }, { name: "background" }]),
  userController.updateProfile
);
userRouter.get(
  "/recomenduser/:userId",
  tokenMiddleware,
  userController.getRecomendUser
);
