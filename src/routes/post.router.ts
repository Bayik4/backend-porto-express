import { Router } from "express";
import postController from "../controllers/post.controller";

const router = Router();

router.post("/", postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.get("/:slug/slug", postController.getPostBySlug);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export default router;