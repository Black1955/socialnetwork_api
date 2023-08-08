import { Router } from "express";
import petsController from "../controllers/pets.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
export const petRouter = Router();

petRouter.get("/get", tokenMiddleware, petsController.getPets);
petRouter.post("/create", tokenMiddleware, petsController.createPet);
