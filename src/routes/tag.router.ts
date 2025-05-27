import { Router } from "express";
import tagController from "../controllers/tag.controller";

const router = Router();

router.get('/', tagController.getAllTag);

export default router;