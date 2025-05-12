import { db } from "../config/firebase";
import Project from "../models/project.model";

const COLLECTION_NAME = 'projects';

const projectRepository = {
  async create(data: Project) {
    const docRef = await db.collection(COLLECTION_NAME).add(data);
    return docRef;
  },

  async getAll() {
    const docRef = await db.collection(COLLECTION_NAME).orderBy("createdAt", "desc").get();
    const projects = docRef.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return projects;
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