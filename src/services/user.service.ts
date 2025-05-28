import User from "../models/user.model";
import userRepository from "../repositories/user.repository";
import { Timestamp } from "firebase-admin/firestore";
import { hashPassword } from "../utils/hashPassword.util";

const userService = {
  async getUserById(id: string) {
    try {
      const user: User = await userRepository.getById(id);
      return user;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },
  
  async getUserByEmail(email: string) {
    try {
      const user = await userRepository.getByEmail(email);
      return user;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async createUser(username: string, email: string, password: string) {
    try {
      const hashedPassword = await hashPassword(password);

      const user = await userRepository.create({
        username,
        email,
        password: hashedPassword,
        photo: {
          name: process.env.DEFAULT_PHOTO_NAME,
          url: process.env.DEFAULT_PHOTO_URL
        },
        createdAt: Timestamp.now() 
      });

      return user; 
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async updateUser(id: string, username: string, email: string) {
    try {
      const user: User = await this.getUserById(id);
      
      await userRepository.update({
        username,
        email,
        photo: {
          name: user.photo?.name,
          url: user.photo?.url
        }
      }, id);

      return user.id;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);     
    }
  },
  
  async addAndUpdatePhoto(id: string, name: string, url: string) {
    try {
      const user: User = await userRepository.getById(id);

      const updatedUser = await userRepository.update({
        username: user?.username,
        email: user?.email,
        photo: {
          name,
          url
        },
      }, id);

      return updatedUser; 
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async deleteUser(id: string) {
    try {
      await this.getUserById(id);
      await userRepository.delete(id);
      return true;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  }
}

export default userService;