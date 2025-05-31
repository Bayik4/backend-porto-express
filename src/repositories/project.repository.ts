import { db } from "../config/firebase";
import Project from "../models/project.model";

const COLLECTION_NAME = 'projects';
const TAG_COLLECTION = 'tag';
const TECH_COLLECTION = 'technologies';

const projectRepository = {
  async create(data: Project) {
    const docRef = await db.collection(COLLECTION_NAME).add(data);
    return docRef;
  },

  async getAll(limit: number = 5, startAfter: string | null) {
    let docRef = db.collection(COLLECTION_NAME).orderBy("createdAt", "desc").limit(limit);
    
    if(startAfter) {
      const lastDoc = await db.collection(COLLECTION_NAME).doc(startAfter).get();
      if(!lastDoc.exists) {
        throw new Error("startAfter documnet not found.");
      }
      docRef = docRef.startAfter(lastDoc)
    }
    
    const snapshot = await docRef.get();

    const projects: Project[] = [];
    let lastVisible: string | null = null;
    
    snapshot.forEach(doc => {
      projects.push({ id: doc.id, ...doc.data() });
      lastVisible = doc.id
    });
    
    const projectsWithTagsAndTech = await Promise.all(projects.map( async (project) => {
      const tags = await Promise.all((project.tags || []).map(async (tag) => {
        const tagRef = await db.collection(TAG_COLLECTION).doc(tag as string).get();
        return {id: tagRef.id, ...tagRef.data()}
      }))

      const tech = await Promise.all((project.technology_used || []).map(async (t) => {
        const techRef = await db.collection(TECH_COLLECTION).doc(t as string).get();
        return { id: techRef.id, ...techRef.data() }
      }))
      
      return {
        id: project.id,
        ...project,
        tags,
        technology_used: tech
      }
    }) || []);

    return {
      data: projectsWithTagsAndTech,
      lastVisible
    };
  },

  async getById(id: string) {
    const docRef = await db.collection(COLLECTION_NAME).doc(id).get();
    if(!docRef.exists) throw new Error("Project not found.");
    const project: Project = { id: docRef.id, ...docRef.data() }
    
    const tags = await Promise.all((project.tags || []).map(async (tag) => {
      const tagRef = await db.collection(TAG_COLLECTION).doc(tag as string).get();
      return { id: tagRef.id, ...tagRef.data() }
    }));

    const tech = await Promise.all((project.technology_used || []).map(async (t) => {
        const techRef = await db.collection(TECH_COLLECTION).doc(t as string).get();
        return { id: techRef.id, ...techRef.data() }
      }))
      
      return {
        id: project.id,
        ...project,
        tags,
        technology_used: tech
      };
  },

  async getBySlug(slug: string) {
    const docRef = await db
      .collection(COLLECTION_NAME)
      .where("slug", "==", slug)
      .get();
    const project: Project[] = docRef.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
    const tags = await Promise.all((project[0].tags || []).map(async (tag) => {
      const tagRef = await db.collection(TAG_COLLECTION).doc(tag as string).get();
      return { id: tagRef.id, ...tagRef.data() }
    }));

    return {
      ...project[0],
      tags
    };
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