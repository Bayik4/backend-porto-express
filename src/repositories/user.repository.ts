import { Timestamp } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import User from "../models/user.model";

const userRepository = {
  async get() {
    const docRef = await db.collection('users').get();
    const users = docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
  },
  
  async getById(id: string) {
    const docRef = db.collection('users').doc(id);
    const user = await docRef.get();
    
    if(!user.exists) throw new Error("User not found.");

    return { id: user.id, ...user.data() }
  },
  
  async create(data: User) {
    const docRef = await db.collection('users').add(data);
    return docRef.id;
  },
  
  async update(data: User, id: string) {
    const docRef = db.collection('users').doc(id);
    
    const updatedData = {
      username: data.username,
      email: data.email,
      photo: data.photo,
      updatedAt: Timestamp.now()      
    }
    
    await docRef.update(updatedData);
    
    return docRef.id;
  },

  async delete(id: string) {
    await this.getById(id);
    await db.collection('users').doc(id).delete();
    return true;
  }
}

export default userRepository;