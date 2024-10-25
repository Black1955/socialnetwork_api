import { Router } from 'express';
import { appConfig } from '../../configs/appConfig.js';
import tokenMiddleware from '../middlewares/token.middleware.js';
export const petRouter = Router();
petRouter.get('/get', tokenMiddleware, appConfig.petController.getPets);
petRouter.post('/create', tokenMiddleware, appConfig.petController.createPet);
