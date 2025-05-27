import { Timestamp } from "firebase-admin/firestore";
import Meta from "./meta.model";
import Thumbnail from "./thumbnail.model";
import User from "./user.model";
import Tag from "./tag.model";

export default interface Project {
  id?: string;
  slug?: string;
  thumbnail?: Thumbnail;
  meta?: Meta;
  author?: User;
  tags?: Tag[] | string[];
  project_name?: string;
  start_date?: Date;
  end_date?: Date;
  description?: string;
  technology_used?: string;
  main_feature?: string;
  contribution?: string;
  challenge?: string;
  photos?: ProjectPhoto[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface ProjectPhoto {
  id?: string;
  publicId?: string;
  url?: string;
  alt?: string;
}