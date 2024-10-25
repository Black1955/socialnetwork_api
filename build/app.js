import express, { json } from 'express';
import { userRouter } from './app/routers/user.router.js';
import { postRouter } from './app/routers/post.router.js';
import { petRouter } from './app/routers/pet.router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config.js';
import expressUpload from 'express-fileupload';
import { errorMiddleware } from './app/middlewares/error.middleware.js';
import { authRouter } from './app/routers/authRouter.js';
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN,
}));
app.use(json());
app.use(expressUpload());
app.use(cookieParser());
app.use('/posts', postRouter);
app.use('/', userRouter);
app.use('/pets', petRouter);
app.use('/auth', authRouter);
app.use(errorMiddleware);
app.listen(port, () => {
    console.log('server has been started');
});
