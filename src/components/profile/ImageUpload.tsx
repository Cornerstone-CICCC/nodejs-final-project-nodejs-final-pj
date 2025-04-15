"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";

interface ImageUploadProps {
  className?: string;
  image?: string;
  onFileSelect: (file: File | null) => void;
}

const ImageUpload = ({ className, image, onFileSelect }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(
    image || undefined
  );

  useEffect(() => {
    setPreview(image || undefined);
  }, [image]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    } else {
      setPreview(image || undefined);
      onFileSelect(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium">Photo</label>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "relative w-32 h-32 rounded-full overflow-hidden border-2 borderdashed transition-colors"
          )}
        >
          <Avatar className="w-full h-full">
            <AvatarImage src={preview} />
            <AvatarFallback className="bg-muted">
              <UserRound className="w-8 h-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>
        <Button onClick={() => document.getElementById("imageInput")?.click()}>
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
