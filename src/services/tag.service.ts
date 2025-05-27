import tagRepository from "../repositories/tag.repository";

const tagService = {
  async getAllTag() {
    const tags = await tagRepository.get();
    return tags;
  },

  async getTagById(id: string) {
    try {
      const tag = await tagRepository.getById(id);
      return tag;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async getTagByName(name: string) {
    try {
      const tag = await tagRepository.getByName(name);
      return tag;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async createTag(name: string) {
    try {
      const createdTag = await tagRepository.create({ name });
      return createdTag;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async updateTag(name: string, id: string) {
    try {
      await tagRepository.getById(id);
      const updatedTag = await tagRepository.update({ id, name });
      return updatedTag;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async deleteTag(id: string) {
    try {
      const deleted = await tagRepository.delete(id);
      return deleted;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  
};

export default tagService;