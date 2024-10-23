import { Router } from 'express';
import { appConfig } from '../../configs/appConfig';
import tokenMiddleware from '../middlewares/token.middleware';
export const authRouter = Router();

authRouter.post('/signin', appConfig.authController.signin);
authRouter.post('signup', appConfig.authController.signup);
authRouter.get('/refresh', tokenMiddleware, appConfig.authController.refresh);
