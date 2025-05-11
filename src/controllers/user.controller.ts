import { Request, Response } from "express";
import { sendFailedResponse, sendSuccessResponse } from "../utils/response.util";
import userService from "../services/user.service";
import cloudinaryService from "../services/cloudinary.service";

const userController = {
  async getUserById(req: Request, res: Response) {
    const {id} = req.params;
    try {
      const user = await userService.getUserById(id);

      sendSuccessResponse(res, user, "Succes get user by id.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "User not found.", 404, [e.message]);
    }
  },

  async createUser(req: Request, res: Response) {
    const { username, email, password } = req.body;
    try {
      const user = await userService.createUser(username, email, password);
      
      sendSuccessResponse(res, {id: user}, "Success create user.", 201);
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed create user.", 422, [e.message]);
    }
  },
  
  async updateUser(req: Request, res: Response) {
    const { username, email } = req.body;
    const { id } = req.params;
    
    try {
      const user = await userService.updateUser(id, username, email);
      sendSuccessResponse(res, { id: user }, "Success update user.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed update user.", 422, [e.message]);
    }
  },

  async uploadPhoto(req: Request, res: Response) {
    const { id } =  req.params;
    try {
      if(!req.file) sendFailedResponse(res, "Image is required.");
      
      const user = await userService.getUserById(id);
      if(user.photo?.name != process.env.DEFAULT_PHOTO_NAME) {
        await cloudinaryService.delete(user.photo?.name!);
      } 

      const { path, filename } = req.file!;
      const data = await userService.addAndUpdatePhoto(id, filename, path);

      sendSuccessResponse(res, {id: data}, "Success upload photo.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed upload photo.", 422, [e.message]);
    }
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
      const user = await userService.getUserById(id);
      await cloudinaryService.delete(user.photo?.name!);
      await userService.deleteUser(id);
      sendSuccessResponse(res, true, "Success delete user.");
    } catch (error) {
      const e = error as Error;
      sendFailedResponse(res, "Failed delete user.", 422, [e.message]);
    }
  }
}

export default userController;