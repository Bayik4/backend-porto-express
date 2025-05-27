import { Timestamp } from "firebase-admin/firestore";
import Project from "../models/project.model";
import projectRepository from "../repositories/project.repository";
import cloudinaryService from "./cloudinary.service";
import tagService from "./tag.service";

const projectService = {
  async createProject(data: Project) {
    try {
      const project = await projectRepository.create({
        ...data,
        createdAt: Timestamp.now(),
      });
      return project;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getAllProject(perPage: number, startAfter: string | null = null) {
    try {
      const projects = await projectRepository.getAll(perPage, startAfter);
      return projects;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getProjectById(id: string) {
    try {
      const data = await projectRepository.getById(id);
      return data;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getProjectBySlug(slug: string) {
    try {
      const project = await projectRepository.getBySlug(slug);
      return project;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async updateProject(data: Project, id: string) {
    try {
      await this.getProjectById(id);
      const updatedProject = await projectRepository.update(
        { ...data, updatedAt: Timestamp.now() },
        id
      );
      return updatedProject;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async deleteProject(id: string) {
    try {
      const project = await this.getProjectById(id);
      if(project.photos) await this.deleteAllProjectImage(project.photos);
      if(project.thumbnail) await cloudinaryService.delete(project.thumbnail.public_id!);
      if(project.meta?.og_image) await cloudinaryService.delete(project.meta.og_image.name!);
      await projectRepository.delete(id);
      return true;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async uploadOrUpdateOgImage(buffer: Buffer, id: string) {
    try {
      const project = await this.getProjectById(id);
      if (project.meta?.og_image)
        await cloudinaryService.delete(project.meta.og_image.name!);

      const { public_id, secure_url } = (await cloudinaryService.manualUpload(
        buffer,
        "og-images",
        "og"
      )) as { public_id: string; secure_url: string };

      await this.updateProject(
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

      return project;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async uploadOrUpdateThumbnail(buffer: Buffer, id: string) {
    try {
      const project = await this.getProjectById(id);
      if (project.meta?.og_image)
        await cloudinaryService.delete(project.meta.og_image.name!);

      const { public_id, secure_url } = (await cloudinaryService.manualUpload(
        buffer,
        "thumbnails",
        "thumb"
      )) as { public_id: string; secure_url: string };

      await this.updateProject(
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
      
      return project;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },
  
  async uploadOrUpdateProjectImages(buffer: Buffer, id: string) {
    try {
      const project = await this.getProjectById(id);
      const { public_id, secure_url } = (await cloudinaryService.manualUpload(
        buffer,
        "photos",
        "project"
      )) as { public_id: string; secure_url: string };
      await this.updateProject({
        photos: [
          ...project.photos ?? [],
          {
            publicId: public_id,
            url: secure_url,
          }
        ]
      }, project.id!);

      return project;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async deleteProjectImage(publicId: string) {
    try {
      await cloudinaryService.delete(publicId);
      return true;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async deleteAllProjectImage(photos: Project['photos']) {
    try {
      photos?.map(async (photo) => {
        await cloudinaryService.delete(photo.publicId!);
      });
      
      return true;
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

export default projectService;