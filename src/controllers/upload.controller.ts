import { Request, Response } from "express";
import { sendFailedResponse, sendSuccessResponse } from "../utils/response.util";
import postService from "../services/post.service";
import cloudinaryService from "../services/cloudinary.service";

const uploadController = {
  async uploadOrUpdateOgImage(req: Request, res: Response) {
    const { collection, id } = req.params;
    try {
      if(!req.file) throw new Error("Image is required.");
      const { path, filename } = req.file!;

      if(collection == "posts") {
        const post = await postService.getPostById(id);
        if(post.meta?.og_image) await cloudinaryService.delete(post.meta?.og_image?.name!);
        await postService.updatePost({
          meta: {
            meta_title: post.meta?.meta_title,
            meta_description: post.meta?.meta_description,
            meta_keywords: post.meta?.meta_keywords,
            og_image: {
              name: filename,
              path
            }
          }
        }, post.id!)
        
        sendSuccessResponse(res, {id: post.id},"Success upload og image.");
        return;
      }
      
      sendSuccessResponse(res, "Success upload og image.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed upload og image.", 422, [e.message]);
    }
  }
}

export default uploadController;