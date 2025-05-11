import { Router } from "express";
import userRouter from "./user.router";
import postRouter from "./post.router";

const router = Router();

router.use("/users", userRouter);
router.use("/posts", postRouter);

export default router;
