import { Timestamp } from "firebase-admin/firestore";
import User from "./user.model";
import Meta from "./meta.model";
import Thumbnail from "./thumbnail.model";

export default interface Post {
  id?: string;
  thumbnail?: Thumbnail;
  meta?: Meta;
  author?: User;
  title?: string;
  description?: string;
  slug?: string;
  content?: string; 
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}