import { Router } from "express";
import userRouter from "./user.router";
import postRouter from "./post.router";
import uploadRouter from "./upload.router";
import projectRouter from "./project.router";
import tagRouter from "./tag.router";
import authRouter from "./auth.router";

const router = Router();

router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/uploads", uploadRouter);
router.use("/projects", projectRouter);
router.use("/tags", tagRouter);
router.use("/auth", authRouter);

export default router;
