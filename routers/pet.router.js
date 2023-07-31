import { Router } from "express";
import petsController from "../controllers/pets.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import { upload } from "../middlewares/file.middleware.js";
export const petRouter = Router();

petRouter.get("/get", tokenMiddleware, petsController.getPets);
petRouter.post(
  "/create",
  upload.single("pet"),
  tokenMiddleware,
  petsController.createPet
);