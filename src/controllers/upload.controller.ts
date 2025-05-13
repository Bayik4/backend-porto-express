import { Request, Response } from "express";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../utils/response.util";
import postService from "../services/post.service";
import cloudinaryService from "../services/cloudinary.service";
import projectService from "../services/project.service";
import Project from "../models/project.model";
import Post from "../models/post.model";

const uploadController = {
  async uploadOrUpdateOgImage(req: Request, res: Response) {
    const { collection, id } = req.params;
    try {
      if (!req.file) throw new Error("Image is required.");
      const { buffer } = req.file!;

      // handle post og image
      if (collection == "posts") {
        const post = await postService.uploadOrUpdateOgImage(buffer, id);

        sendSuccessResponse(res, { id: post.id }, "Success upload og image.");
        return;
      }

      // handle project og image 
      const project = await projectService.uploadOrUpdateOgImage(buffer, id);

      sendSuccessResponse(res, { id: project.id }, "Success upload og image.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed upload og image.", 422, [e.message]);
    }
  },

  async uploadOrUpadateThumbnail(req: Request, res: Response) {
    const { collection, id } = req.params;
    try {
      if (!req.file) throw new Error("Image is required.");
      const { buffer } = req.file!;

      // handle post thumbnail
      if (collection == "posts") {
        const post = await postService.uploadOrUpdateThumbnail(buffer, id);

        sendSuccessResponse(res, { id: post.id }, "Success upload thumbnail.");
        return;
      }

      // handle project thumbnail
      const project = await projectService.uploadOrUpdateThumbnail(buffer, id);

      sendSuccessResponse(res, { id: project.id }, "Success upload thumbnail.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed upload thumbnail.", 422, [e.message]);
    }
  },
};

export default uploadController;
