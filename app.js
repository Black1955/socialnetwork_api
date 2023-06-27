import express, { json } from "express";
import { userRouter } from "./routers/user.router.js";
import { postRouter } from "./routers/post.router.js";
import { petRouter } from "./routers/pet.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config.js";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middlewares/error.middleware.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.SERVER_PORT || 5000;
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(json());
app.use("/imgStorage", express.static(path.join(__dirname, "imgStorage")));
app.use(cookieParser());
app.use("/posts", postRouter);
app.use("/", userRouter);
app.use("/pets", petRouter);
app.use(errorMiddleware);
app.listen(port, () => {
  console.log("server has been started");
});
