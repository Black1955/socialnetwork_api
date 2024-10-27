import { Router } from 'express';
import { appConfig } from '../../configs/appConfig.js';
import tokenMiddleware from '../middlewares/token.middleware.js';
export const authRouter = Router();

authRouter.post('/signin', appConfig.authController.signin);
authRouter.post('/signup', appConfig.authController.signup);
authRouter.get('/refresh', tokenMiddleware, appConfig.authController.refresh);
