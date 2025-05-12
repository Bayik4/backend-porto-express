import { Router } from "express";
import projectController from "../controllers/project.controller";

const router = Router();

router.post("/", projectController.createProject);
router.get("/", projectController.getAllProject);
router.get("/:id", projectController.getProjectById);
router.get("/:slug/slug", projectController.getProjectBySlug);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;