import Technology from "../models/technology.model";
import technologyRepository from "../repositories/technology.repository";

const technologyService = {
  async getAllTechnology() {
    try {
      const data = await technologyRepository.getAll();
      return data;
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },

  async createOrUpdateTechnology(names: string[]) {
    return Promise.all(names.map(async (name) => {
      let tech = await technologyRepository.getTechnologyByName(name);
      if(!tech) {
        const newTech = await technologyRepository.create({ name });
        tech = { id: newTech }
      }
      
      return tech.id;
    }) || []);
  },

}

export default technologyService;