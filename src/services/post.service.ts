import { Timestamp } from "firebase-admin/firestore";
import Post from "../models/post.model";
import postRepository from "../repositories/post.repository";

const postService = {
  async createPost(data: Post) {
    try {
      const post = await postRepository.create({
        ...data,
        createdAt: Timestamp.now()
      });
      return post;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getAllPosts() {
    try {
      const posts = await postRepository.getAll();
      return posts;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getPostById(id: string) {
    try {
      const rawData = await postRepository.getById(id);
      const post: Post = {
        id: rawData.id,
        ...rawData.data()
      }
      return post;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getPostBySlug(slug: string) {
    try {
      const post = await postRepository.getBySlug(slug);
      return post;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },
  
  async updatePost(data: Post, id: string) {
    try {
      const updatedPost = await postRepository.update({
        ...data,
        updatedAt: Timestamp.now()
      }, id);
      return updatedPost;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async deletePost(id: string) {
    try {
      return await postRepository.delete(id);
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  }
};

export default postService;