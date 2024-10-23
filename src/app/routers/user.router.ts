import { Router } from 'express';
import { appConfig } from '../../configs/appConfig';
import tokenMiddleware from '../middlewares/token.middleware';
import UserMiddleware from '../middlewares/UserMiddleware';

export const userRouter = Router();

userRouter.get(
  '/getuser/:id',
  tokenMiddleware,
  appConfig.userController.getUser,
  UserMiddleware
);
userRouter.post(
  '/subscribe',
  tokenMiddleware,
  appConfig.userController.SubscribeUser
);
userRouter.post(
  '/unsubscribe',
  tokenMiddleware,
  appConfig.userController.unSubscribeUser
);
//userRouter.put('/setphoto', tokenMiddleware, userController.setPhoto);
userRouter.get(
  '/search',
  tokenMiddleware,
  appConfig.userController.searchUsers
);
//userRouter.put('/updateprofile', tokenMiddleware, userController.updateProfile);
userRouter.get(
  '/recomenduser/:userId',
  tokenMiddleware,
  appConfig.userController.getRecomendUser
);
