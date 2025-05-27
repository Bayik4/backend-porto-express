import { Router } from "express";
import tagController from "../controllers/tag.controller";

const router = Router();

router.get('/', tagController.getAllTag);
router.get('/:id', tagController.getTagById);
router.put('/:id', tagController.updateTag);

export default router;