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
        const post: Post = await postService.getPostById(id);
        if (post.meta?.og_image)
          await cloudinaryService.delete(post.meta?.og_image?.name!);

        const { public_id, secure_url } = (await cloudinaryService.manualUpload(
          buffer,
          "og-images",
          "og"
        )) as { public_id: string; secure_url: string };

        await postService.updatePost(
          {
            meta: {
              meta_title: post.meta?.meta_title,
              meta_description: post.meta?.meta_description,
              meta_keywords: post.meta?.meta_keywords,
              og_image: {
                name: public_id,
                path: secure_url,
              },
            },
          },
          post.id!
        );

        sendSuccessResponse(res, { id: post.id }, "Success upload og image.");
        return;
      }

      // handle project og image 
      const project: Project = await projectService.getProjectById(id);
      if (project.meta?.og_image)
        await cloudinaryService.delete(project.meta.og_image.name!);
      
      const { public_id, secure_url } = (await cloudinaryService.manualUpload(
          buffer,
          "og-images",
          "og"
        )) as { public_id: string; secure_url: string };

      await projectService.updateProject(
        {
          meta: {
            meta_title: project.meta?.meta_title,
            meta_description: project.meta?.meta_description,
            meta_keywords: project.meta?.meta_keywords,
            og_image: {
              name: public_id,
              path: secure_url,
            },
          },
        },
        project.id!
      );

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
        const post = await postService.getPostById(id);
        if (post.meta?.og_image)
          await cloudinaryService.delete(post.meta?.og_image?.name!);

        const { public_id, secure_url } = (await cloudinaryService.manualUpload(
          buffer,
          "og-images",
          "og"
        )) as { public_id: string; secure_url: string };

        await postService.updatePost(
          {
            thumbnail: {
              public_id: public_id,
              url: secure_url,
              alt: post.thumbnail?.alt ?? "",
              caption: post.thumbnail?.caption ?? "",
            },
          },
          post.id!
        );

        sendSuccessResponse(res, { id: post.id }, "Success upload thumbnail.");
        return;
      }

      // handle project thumbnail
      const project: Project = await projectService.getProjectById(id);
      if (project.meta?.og_image)
        await cloudinaryService.delete(project.meta.og_image.name!);

      const { public_id, secure_url } = (await cloudinaryService.manualUpload(
        buffer,
        "thumbnails",
        "thumb"
      )) as { public_id: string; secure_url: string };

      await projectService.updateProject(
        {
          thumbnail: {
            public_id: public_id,
            url: secure_url,
            alt: project.thumbnail?.alt ?? "",
            caption: project.thumbnail?.caption ?? "",
          },
        },
        project.id!
      );
      sendSuccessResponse(res, { id: project.id }, "Success upload thumbnail.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed upload thumbnail.", 422, [e.message]);
    }
  },
};

export default uploadController;
