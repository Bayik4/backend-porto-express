import User from "../models/user.model";
import { verifyPassword } from "../utils/hashPassword.util";
import { generateToken } from "../utils/jwt.util";
import userService from "./user.service";

interface LoginRequest {
  email: string;
  password: string;
}

const authService = {
  async login(data: LoginRequest) {
    try {
      const user: User = await userService.getUserByEmail(data.email);
      const verifiedPassword = await verifyPassword(data.password, user.password!);
      if(!verifiedPassword) throw new Error("Email or password wrong.");
      
      const token = generateToken({userId: user.id});
      
      return token;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  }
}

export default authService;