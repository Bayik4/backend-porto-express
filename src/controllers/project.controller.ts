import { Request, Response } from "express";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../utils/response.util";
import projectService from "../services/project.service";
import { makeSlug } from "../utils/slug.util";

const projectController = {
  async createProject(req: Request, res: Response) {
    const {
      meta_title,
      meta_description,
      meta_keywords,
      project_name,
      start_date,
      end_date,
      description,
      technology_used,
      main_feature,
      contribution,
      challenge,
      tags
    } = req.body;

    try {
      const projectTags = await projectService.createOrUpdateTag(tags);
      const project = await projectService.createProject({
        slug: makeSlug(project_name),
        meta: {
          meta_title,
          meta_description,
          meta_keywords,
        },
        project_name,
        start_date,
        end_date,
        description,
        technology_used,
        main_feature,
        contribution,
        challenge,
        tags: projectTags
      });

      sendSuccessResponse(
        res,
        { id: project.id },
        "Success create project.",
        201
      );
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed create project.", 422, [e.message]);
    }
  },

  async getAllProject(req: Request, res: Response) {
    const perPage = req.query.perPage || 5;
    const startAfter = req.query.startAfter as string || null;
    try {
      const projects = await projectService.getAllProject(Number(perPage), startAfter);
      sendSuccessResponse(res, { list: projects.data, lastVisible: projects.lastVisible }, "Success get all project.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed get all project.", 422, [e.message]);
    }
  },

  async getProjectById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const project = await projectService.getProjectById(id);
      sendSuccessResponse(res, project, "Success get project.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed get project.", 422, [e.message]);
    }
  },

  async getProjectBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const project = await projectService.getProjectBySlug(slug);
      sendSuccessResponse(res, project, "Success get project.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed get project.", 422, [e.message]);
    }
  },

  async updateProject(req: Request, res: Response) {
    const {
      slug,
      meta_title,
      meta_description,
      meta_keywords,
      project_name,
      start_date,
      end_date,
      description,
      technology_used,
      main_feature,
      contribution,
      challenge,
      tags
    } = req.body;
    const {id} = req.params;

    try {
      const projectTags = await projectService.createOrUpdateTag(tags);
      await projectService.updateProject({
        slug,
        meta: {
          meta_title,
          meta_description,
          meta_keywords,
        },
        project_name,
        start_date,
        end_date,
        description,
        technology_used,
        main_feature,
        contribution,
        challenge,  
        tags: projectTags
      }, id);
      
      sendSuccessResponse(res, {id}, "Success update project.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed update project.", 422, [e.message]);
    }
  },
  
  async deleteProject(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await projectService.deleteProject(id);
      sendSuccessResponse(res, null, "Success delete project.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed delete project.", 422, [e.message]);
    }
  }
};

export default projectController;
