import { Request, Response } from "express";
import { sendFailedResponse, sendSuccessResponse } from "../utils/response.util";
import authService from "../services/auth.service";

const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const token = await authService.login({ email, password })
      sendSuccessResponse(res, {token}, "Success login.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed login.", 422, [e.message]);
    }
  },
}

export default authController;