import { Router } from "express";
import cloudinaryService from "../services/cloudinary.service";
import uploadController from "../controllers/upload.controller";

const router = Router();

router.post(
  "/:collection/:id/og-image",
  cloudinaryService.upload("og-images", "og").single("og-image"),
  uploadController.uploadOrUpdateOgImage
);

router.post(
  "/:collection/:id/thumbnail",
  cloudinaryService.upload("thumbnails", "thumb").single("thumbnail"),
  uploadController.uploadOrUpadateThumbnail
);

export default router;
