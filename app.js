import express, { json } from "express";
import { userRouter } from "./routers/user.router.js";
import { postRouter } from "./routers/post.router.js";
import { petRouter } from "./routers/pet.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config.js";
import expressUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.middleware.js";
const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);
app.use(json());
app.use(expressUpload());
app.use(cookieParser());
app.use("/posts", postRouter);
app.use("/", userRouter);
app.use("/pets", petRouter);
app.use(errorMiddleware);
app.listen(port, () => {
  console.log("server has been started");
});
