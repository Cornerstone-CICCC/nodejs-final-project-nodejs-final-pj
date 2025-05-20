"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
  className?: string;
  image?: string;
  onFileSelect: (file: File | null) => void;
}

const ImageUpload = ({ className, image, onFileSelect }: ImageUploadProps) => {
  const defaultImage = "/default-profile.png";
  const [preview, setPreview] = useState<string>(image || defaultImage);

  useEffect(() => {
    setPreview(image || defaultImage);
  }, [image]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    } else {
      setPreview(image || defaultImage);
      onFileSelect(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium">Photo</label>
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 transition-colors">
          <Image
            src={preview}
            alt="Profile Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <Button onClick={() => document.getElementById("imageInput")?.click()}> {/** Use useRef instead of relying on getElementById */}
          Change
          <input
            id="imageInput"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
