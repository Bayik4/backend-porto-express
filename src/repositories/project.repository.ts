import { db } from "../config/firebase";
import Project from "../models/project.model";

const COLLECTION_NAME = 'projects';

const projectRepository = {
  async create(data: Project) {
    const docRef = await db.collection(COLLECTION_NAME).add(data);
    return docRef;
  },

  async getAll(limit: number = 5, startAfter: string | null) {
    let docRef = db.collection(COLLECTION_NAME).orderBy("createdAt", "desc").limit(limit);
    console.log(startAfter);
    
    if(startAfter) {
      const lastDoc = await db.collection(COLLECTION_NAME).doc(startAfter).get();
      if(!lastDoc.exists) {
        throw new Error("startAfter documnet not found.");
      }
      docRef = docRef.startAfter(lastDoc)
    }
    
    const snapshot = await docRef.get();

    const products: Project[] = [];
    let lastVisible: string | null = null;
    
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
      lastVisible = doc.id
    });

    return {
      data: products,
      lastVisible
    };
  },

  async getById(id: string) {
    const docRef = await db.collection(COLLECTION_NAME).doc(id).get();
    return docRef;
  },

  async getBySlug(slug: string) {
    const docRef = await db
      .collection(COLLECTION_NAME)
      .where("slug", "==", slug)
      .get();
    const project = docRef.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return project;
  },

  async update(data: Project, id: string) {
    return await db
      .collection(COLLECTION_NAME)
      .doc(id)
      .update({ ...data });
  },

  async delete(id: string) {
    return await db.collection(COLLECTION_NAME).doc(id).delete();
  },
};

export default projectRepository;