import { Timestamp } from "firebase-admin/firestore";
import Post from "../models/post.model";
import postRepository from "../repositories/post.repository";
import cloudinaryService from "./cloudinary.service";
import tagService from "./tag.service";

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

  async getAllPosts(perPage: number, startAfter: string | null) {
    try {
      const data = await postRepository.getAll(perPage, startAfter);
      return data;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getPostById(id: string) {
    try {
      const post = await postRepository.getById(id);
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
      const post = await this.getPostById(id);
      if(post.meta?.og_image) await cloudinaryService.delete(post.meta.og_image.name!);
      if(post.thumbnail) await cloudinaryService.delete(post.thumbnail.public_id!);
      await postRepository.delete(id);
      return true;
      } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async uploadOrUpdateOgImage(buffer: Buffer, id: string) {
    try {
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
        
        return post;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async uploadOrUpdateThumbnail(buffer: Buffer, id: string) {
    try {
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
      
      return post;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async createOrUpdateTag(tags: string[]) {
    return await Promise.all(
      tags.map(async (name: string) => {
        let tag = await tagService.getTagByName(name);

        if (!tag) {
          const newTag = await tagService.createTag(name);
          tag = { id: newTag };
        }

        return tag.id;
      }) || []
    );
  },
};

export default postService;