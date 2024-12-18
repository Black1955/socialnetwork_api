import { Router } from 'express';
import { appConfig } from '../../configs/appConfig.js';
import tokenMiddleware from '../middlewares/token.middleware.js';
import PostMiddleware from '../middlewares/PostMiddleware.js';
export const postRouter = Router();
postRouter.get(
  '/',
  tokenMiddleware,
  appConfig.postController.Get,
  PostMiddleware
);
postRouter.post(
  '/create',
  tokenMiddleware,
  appConfig.postController.Create,
  PostMiddleware
);
postRouter.get(
  '/recomendposts/:id',
  tokenMiddleware,
  appConfig.postController.getRecomended,
  PostMiddleware
);
postRouter.post('/like', tokenMiddleware, appConfig.postController.Like);
postRouter.post('/dislike', tokenMiddleware, appConfig.postController.Dislike);
