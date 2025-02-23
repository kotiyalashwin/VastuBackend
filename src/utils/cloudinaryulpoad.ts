import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImageToCloudinary = async (
  imageBuffer: Buffer,
  folderPath: string
) => {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folderPath,
            resource_type: "image",
            format: "webp",
            type: "upload",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(imageBuffer);
    });

    return {
      result: result,
      url: result?.secure_url || "",
      public_id: result?.public_id || "",
    };
  } catch (error) {
    throw new Error(`Error uploading to Cloudinary: ${error}`);
  }
};
