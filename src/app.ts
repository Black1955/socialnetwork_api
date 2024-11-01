import express, { json } from 'express';
import { userRouter } from './app/routers/user.router.js';
import { postRouter } from './app/routers/post.router.js';
import { petRouter } from './app/routers/pet.router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import expressUpload from 'express-fileupload';
import { errorMiddleware } from './app/middlewares/error.middleware.js';
import { authRouter } from './app/routers/authRouter.js';
import { ORIGIN, PORT, LOCAL_STORAGE_PATH } from './configs/checkENV.js';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  cors({
    credentials: true,
    origin: ORIGIN,
  })
);
app.use(json());
app.use(expressUpload());
app.use(cookieParser());
app.use(
  `${LOCAL_STORAGE_PATH}`,
  express.static(path.join(__dirname, `..${LOCAL_STORAGE_PATH}`))
);
app.use('/post', postRouter);
app.use('/', userRouter);
app.use('/pet', petRouter);
app.use('/auth', authRouter);
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log('server has been started');
});
