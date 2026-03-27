/**
 * Utility function to upload media to Cloudinary.
 * Works for both images and videos.
 * 
 * @param file The file object (from input change event)
 * @returns The secure URL of the uploaded asset
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary cloud name or upload preset is missing in .env");
    throw new Error("Cloudinary not configured. Please add keys to .env");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // Determine if it's a video or image based on file type
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Cloudinary Upload Failed");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
