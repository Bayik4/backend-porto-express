import { db } from "../config/firebase";
import Post from "../models/post.model";

const COLLECTION_NAME = "posts";
const TAG_COLLECTION = "tag";

const postRepository = {
  async create(data: Post) {
    return await db.collection(COLLECTION_NAME).add(data);
  },

  async getAll(limit: number = 12, startAfter?: string | null) {
    let docRef = db.collection(COLLECTION_NAME).limit(limit);
    
     if(startAfter) {
      const lastDoc = await db.collection(COLLECTION_NAME).doc(startAfter).get();
      if(!lastDoc.exists) {
        throw new Error("startAfter documnet not found.");
      }
      docRef = docRef.startAfter(lastDoc)
    }
    
    const snapshot = await docRef.get();
    
    const posts: Post[] = [];
    let lastVisible: string | null = null;
    
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
      lastVisible = doc.id
    });

    const postWithTags = await Promise.all(posts.map(async (post) => {
      const tags = await Promise.all((post.tags || []).map(async (tag) => {
        const tagRef = await db.collection(TAG_COLLECTION).doc(tag as string).get();
        return { id: tagRef.id, ...tagRef.data() }
      }));
      
      return {
        id: post.id,
        ...post,
        tags
      }
    }));

    return {
      data: postWithTags,
      lastVisible
    };
  },

  async getById(id: string) {
    const docRef = await db.collection(COLLECTION_NAME).doc(id).get();
    const post: Post = { id: docRef.id, ...docRef.data() }

    const postTags = await Promise.all((post.tags || []).map(async (tag) => {
      const tagRef = await db.collection(TAG_COLLECTION).doc(tag as string).get();
      return { id: tagRef.id, ...tagRef.data() }
    }));

    return {
      ...post,
      tags: postTags
    };
  },

  async getBySlug(slug: string) {
    const docRef = await db.collection(COLLECTION_NAME).where('slug', '==', slug).get();
    const post: Post[] = docRef.docs.map(doc => ({id: doc.id, ...doc.data()}));
    
    if(post.length === 0) throw new Error("Post not found.");
    
    const postTags = await Promise.all((post[0].tags || []).map(async (tag) => {
      const tagRef = await db.collection(TAG_COLLECTION).doc(tag as string).get();
      return { id: tagRef.id, ...tagRef.data() }
    }));

    return {
      ...post[0],
      tags: postTags
    };
  },

  async update(data: Post, id: string) {
    const post = await db.collection(COLLECTION_NAME).doc(id).get();
    if(!post.exists) throw new Error("Post not found.");

    const docRef = await db.collection(COLLECTION_NAME).doc(id).update({...data});
    return docRef;
  },

  async delete(id: string) {
    const post = await db.collection(COLLECTION_NAME).doc(id).get();
    if(!post.exists) throw new Error("Post not found.");

    await db.collection(COLLECTION_NAME).doc(id).delete();
    return true; 
  }
}

export default postRepository;