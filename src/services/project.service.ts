import { Timestamp } from "firebase-admin/firestore";
import Project from "../models/project.model";
import projectRepository from "../repositories/project.repository";

const projectService = {
  async createProject(data: Project) {
    try {
      const project = await projectRepository.create({...data, createdAt: Timestamp.now()});
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
      if(!data.exists) throw new Error("Project not found.");
      const project = { id: data.id, ...data.data() }
      return project;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },
  
  async getProjectBySlug(slug: string) {
    try {
      const project = await projectRepository.getBySlug(slug);
      if(project.length == 0) throw new Error("Project not found.");
      return project[0];
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },
  
  async updateProject(data: Project, id: string) {
    try {
      await this.getProjectById(id);
      const updatedProject = await projectRepository.update({...data, updatedAt: Timestamp.now()}, id);
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
  }
}

export default projectService;