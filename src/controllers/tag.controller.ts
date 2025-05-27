import { Request, Response } from "express";
import { sendSuccessResponse, sendFailedResponse } from "../utils/response.util";
import tagService from "../services/tag.service";

const tagController = {
  async getAllTag(req: Request, res: Response) {
    try {
      const tags = await tagService.getAllTag();
      sendSuccessResponse(res, tags, "Success get tags.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed get tags.", 500, [e.message]);
    }
  },

  async getTagById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const tag = await tagService.getTagById(id);
      sendSuccessResponse(res, tag, "Success get tag by id.", 200);
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed get tag by id.", 500, [e.message]);
    }
  },

  async updateTag(req: Request, res: Response) {
    const { name } = req.body;
    const { id } = req.params;
    console
    try {
      const updatedTag = await tagService.updateTag(name, id);
      sendSuccessResponse(res, {id: updatedTag}, "SUccess update tag.");
    } catch (error) {
      const e = error as Error;     
      sendFailedResponse(res, "Failed update tag.", 500, [e.message]);
    }
  }
}

export default tagController;