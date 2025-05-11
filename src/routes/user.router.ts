import { Router } from "express";
import userController from "../controllers/user.controller";
import cloudinaryService from "../services/cloudinary.service";

const router = Router();

router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// upload photo
router.post('/:id/upload', cloudinaryService.upload("photos", "photo").single("photo"), userController.uploadPhoto);

export default router;