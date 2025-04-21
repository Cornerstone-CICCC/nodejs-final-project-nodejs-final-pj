import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/firebase";

export const useFirebaseStorage = () => {
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Upload image to Firebase Storage
  const uploadImage = async (
    file: File | null,
    folderName: string
  ): Promise<string> => {
    if (!file) {
      return "";
    }

    const fileRef = ref(storage, `${folderName}/${file.name}`);

    setImageLoading(true);
    setImageError(null);

    try {
      const uploadedFile = await uploadBytes(fileRef, file);
      console.log("Image uploaded:", uploadedFile);

      return uploadedFile.metadata.fullPath;
    } catch (err) {
      console.error(err);
      setImageError("An error occurred.");
      throw err;
    } finally {
      setImageLoading(false);
    }
  };

  // Fetch image URL from Firebase Storage
  const getImageUrl = async (path: string): Promise<string> => {
    const basePath = process.env.NEXT_PUBLIC_FIREBASE_FOLDER_PATH;
    const fileRef = ref(storage, `${basePath}/${path}`);

    setImageLoading(true);
    setImageError(null);

    try {
      const url = await getDownloadURL(fileRef);
      console.log("Image URL:", url);

      return url;
    } catch (err) {
      console.error(err);
      setImageError("An error occurred.");
      throw err;
    } finally {
      setImageLoading(false);
    }
  };

  return { uploadImage, getImageUrl, imageLoading, imageError };
};
