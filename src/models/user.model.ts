import { Timestamp } from "firebase-admin/firestore";

export default interface User {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  photo?: Photo;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface Photo {
  name?: string;
  url?: string;
}