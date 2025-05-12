import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import env from "dotenv";
import streamifier from "streamifier";

env.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryService = {
  upload(folder: string, prefix: string) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        return {
          folder: folder,
          format: "webp",
          public_id: `${prefix}_${Date.now()}`,
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        };
      },
    });

    return multer({ storage });
  },

  getMulterMemoryStorage() {
    const storage = multer.memoryStorage();
    return multer({ storage });
  },

  manualUpload(buffer: Buffer, folder: string, prefix: string) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: `${prefix}_${Date.now()}`,
          format: "webp",
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (result)
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              display_name: result.display_name
            });
          reject(error);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  },

  async delete(publicId: string) {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      const e = error as Error;
      throw new Error(e.message);
    }
  },
};

export default cloudinaryService;
