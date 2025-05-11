import { db } from "../config/firebase";
import Post from "../models/post.model";

const COLLECTION_NAME = "posts";

const postRepository = {
  async create(data: Post) {
    return await db.collection(COLLECTION_NAME).add(data);
  },

  async getAll() {
    const docRef = await db.collection(COLLECTION_NAME).get();
    const posts = docRef.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return posts;
  },

  async getById(id: string) {
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const post = await docRef.get();
    return post;
  },

  async getBySlug(slug: string) {
    const docRef = await db.collection(COLLECTION_NAME).where('slug', '==', slug).get();
    const post = docRef.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return post[0];
  },

  async update(data: Post, id: string) {
    const post = await this.getById(id);
    if(!post.exists) throw new Error("Post not found.");

    const docRef = await db.collection(COLLECTION_NAME).doc(id).update({...data});
    return docRef;
  },

  async delete(id: string) {
    const post = await this.getById(id);
    if(!post.exists) throw new Error("Post not found.");

    await db.collection(COLLECTION_NAME).doc(id).delete();
    return true; 
  }
}

export default postRepository;