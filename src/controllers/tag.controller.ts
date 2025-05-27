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
  }
}

export default tagController;