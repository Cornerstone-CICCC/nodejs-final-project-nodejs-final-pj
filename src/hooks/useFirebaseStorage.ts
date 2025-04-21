import { useState } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase/firebase";

export const useFirebaseStorage = () => {
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Upload image to Firebase Storage and return the URL
  const uploadImage = async (
    file: File | null,
    folderName: string,
    oldImagePath?: string
  ): Promise<string> => {
    if (!file) {
      return "";
    }

    const fileRef = ref(storage, `${folderName}/${file.name}`);

    setImageLoading(true);
    setImageError(null);

    try {
      // Delete old image if path is provided
      if (oldImagePath) {
        await deleteImage(oldImagePath);
      }

      // Upload new image
      await uploadBytes(fileRef, file);

      // Get and return the URL of the uploaded image
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (err) {
      console.error(err);
      setImageError("An error occurred during upload.");
      throw err;
    } finally {
      setImageLoading(false);
    }
  };

  // Delete image from Firebase Storage
  const deleteImage = async (path: string): Promise<void> => {
    const fileRef = ref(storage, path);

    try {
      await deleteObject(fileRef);
    } catch (err) {
      console.error(`Failed to delete image at ${path}:`, err);
      throw err;
    }
  };

  return { uploadImage, deleteImage, imageLoading, imageError };
};
