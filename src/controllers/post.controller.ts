import { Request, Response } from "express";
import postService from "../services/post.service";
import { sendFailedResponse, sendSuccessResponse } from "../utils/response.util";
import cloudinaryService from "../services/cloudinary.service";

const postController = {
  async createPost(req: Request, res: Response) {
    const {
      meta_title,
      meta_description,
      meta_keywords,
      title,
      description,
      slug,
      content,
    } = req.body;
    try {
      const post = await postService.createPost({
        meta: {
          meta_title,
          meta_description,
          meta_keywords,
        },
        title,
        description,
        slug,
        content,
      });

      sendSuccessResponse(res, { id: post.id }, "Success create post.", 201);
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed create post.", 422, [e.message]);
    }
  },

  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await postService.getAllPosts();

      sendSuccessResponse(res, posts, "Success get all post.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed get all post.", 422, [e.message]);
    }
  },

  async getPostById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const post = await postService.getPostById(id);
      sendSuccessResponse(res, post, "Success get post by id.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed get post by id.", 422, [e.message]);
    }
  },

  async getPostBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const post = await postService.getPostBySlug(slug);
      sendSuccessResponse(res, post, "Success get post by slug.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed get post by slug.", 422, [e.message]);
    }
  },

  async updatePost(req: Request, res: Response) {
    const {
      meta_title,
      meta_description,
      meta_keywords,
      title,
      description,
      slug,
      content,
    } = req.body;
    const { id } = req.params;

    try {
      await postService.updatePost({
        meta: {
          meta_title,
          meta_description,
          meta_keywords
        },
        title,
        description,
        slug,
        content
      }, id);
      
      sendSuccessResponse(res, {id}, "Success update post.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed update post.", 422, [e.message]);
    }
  },
  
  async deletePost(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await postService.deletePost(id);

      sendSuccessResponse(res, null, "Success delete post.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed delete post.", 422, [e.message]);
    }
  }
};

export default postController;