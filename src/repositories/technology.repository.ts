import { db } from "../config/firebase";
import Technology from "../models/technology.model";

const COLLECTION_NAME = 'technologies';

const technologyRepository = {
  async getAll() {
    const docRef = await db.collection(COLLECTION_NAME).get();
    const data = docRef.docs.map(doc => ({id: doc.id, ...doc.data()}));
    
    return data;
  },
  
  async getTechnologyByName(name: string) {
    const docRef = db.collection(COLLECTION_NAME);
    const snapshot = await docRef.where('name', '==', name).get();
    
    if(snapshot.empty) return false;

    return { 
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
     }
  },

  async create(tech: Technology) {
    const docRef = await db.collection(COLLECTION_NAME).add(tech);
    return docRef.id;
  },

  async update(tech: Technology) {
    const isExsist = await db.collection(COLLECTION_NAME).doc(tech.id!).get();

    if(!isExsist) throw new Error("Technology not found.");
    
    const docRef = db.collection(COLLECTION_NAME).doc(tech.id!);
    await docRef.update({...tech});

    return docRef.id;
  }
}

export default technologyRepository;