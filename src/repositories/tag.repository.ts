import { db } from "../config/firebase";
import Tag from "../models/tag.model";

const COLLECTION_NAME = 'tag';

const tagRepository = {
  async get() {
    const docRef = await db.collection(COLLECTION_NAME).get();
    const data = docRef.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data; 
  },

  async getById(id: string) {
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const data = await docRef.get();
    
    if(!data.exists) throw new Error("Tag not found.");
    
    return { id: data.id, ...data.data() }
  },
  
  async getByName(name: string) {
    const docRef = await db.collection(COLLECTION_NAME).where('name', '==', name).get();
    const data = docRef.docs.map(tag => ({ id: tag.id, ...tag.data() }));
    
    // if(data.length === 0) throw new Error("Tag not found.");
    
    return data[0];
  },

  async create(tag: Tag) {
    try {
      const docRef = await db.collection(COLLECTION_NAME).add(tag);
      return docRef.id;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async update(tag: Tag) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(tag.id!);
      await docRef.update({ name: tag.name });

      return docRef.id;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async delete(id: string) {
    try {
      await db.collection(COLLECTION_NAME).doc(id).delete();
      return true;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  }
}

export default tagRepository;