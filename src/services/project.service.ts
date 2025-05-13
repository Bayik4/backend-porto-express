import { Timestamp } from "firebase-admin/firestore";
import Project from "../models/project.model";
import projectRepository from "../repositories/project.repository";
import cloudinaryService from "./cloudinary.service";

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

  async getAllProject() {
    try {
      const projects = await projectRepository.getAll();
      return projects;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getProjectById(id: string) {
    try {
      const data = await projectRepository.getById(id);
      if (!data.exists) throw new Error("Project not found.");
      const project = { id: data.id, ...data.data() };
      return project;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getProjectBySlug(slug: string) {
    try {
      const project = await projectRepository.getBySlug(slug);
      if (project.length == 0) throw new Error("Project not found.");
      return project[0];
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
      await projectRepository.delete(id);
      return true;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async uploadOrUpdateOgImage(buffer: Buffer, id: string) {
    try {
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

      return project;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async uploadOrUpdateThumbnail(buffer: Buffer, id: string) {
    try {
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
      
      return project;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },
};

export default projectService;