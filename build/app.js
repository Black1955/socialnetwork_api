import express, { json } from 'express';
import { userRouter } from './app/routers/user.router.js';
import { postRouter } from './app/routers/post.router.js';
import { petRouter } from './app/routers/pet.router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import expressUpload from 'express-fileupload';
import { errorMiddleware } from './app/middlewares/error.middleware.js';
import { authRouter } from './app/routers/authRouter.js';
import { ORIGIN, PORT } from './configs/checkENV.js';
const app = express();
app.use(cors({
    credentials: true,
    origin: ORIGIN,
}));
app.use(json());
app.use(expressUpload());
app.use(cookieParser());
app.use('/post', postRouter);
app.use('/', userRouter);
app.use('/pet', petRouter);
app.use('/auth', authRouter);
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log('server has been started');
});
