"use client";

import { UserFormInputs, userSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useUserStore from "@/stores/useUserStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ImageUpload from "@/components/profile/ImageUpload";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useUpdateUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { useRouter } from "next/navigation";

const ProfileEditForm = () => {
  const { user, setUser } = useUserStore();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const { onSubmit, loading, showError, errorMessage } = useUpdateUser();
  const { uploadImage } = useFirebaseStorage();

  const router = useRouter();

  const form = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "New user",
      userName: user?.userName || "",
      bio: user?.bio || "Nice to meet you!",
    },
  });

  const userId = user?.id;

  const bioValue = form.watch("bio");
  const bioLength = bioValue?.length || 0;
  const nameValue = form.watch("name");
  const nameLength = nameValue?.length || 0;
  const usernameValue = form.watch("userName");
  const usernameLength = usernameValue?.length || 0;

  const onSave: SubmitHandler<UserFormInputs> = async (data) => {
    if (!userId) {
      throw new Error("User ID is not available");
    }

    try {
      // Upload the image to Firebase Storage
      let fileId = user.fileId;

      if (uploadedImage) {
        fileId = await uploadImage(uploadedImage, `profile-images/${user.id}`, user.fileId);
      }

      const { name, userName, bio } = data;
      const updatedUser: User = {
        id: userId,
        name,
        userName,
        email: user.email,
        bio,
        fileId: fileId,
      };

      const res = await onSubmit(updatedUser);

      if (!res) {
        throw new Error("Failed to update user");
      }

      setUser(updatedUser);
      router.push(`/profile/${user.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <Alert className={showError ? "" : "hidden"}>
        <AlertCircle color="red" className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {errorMessage && <p>{errorMessage}</p>}
        </AlertDescription>
      </Alert>

      <ImageUpload onFileSelect={setUploadedImage} image={user?.fileId} />

      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white/70 flex justify-center items-center">
          <p className="text-xl">Loading...</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <div className="flex justify-between">
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <p className="text-right text-gray-400">{nameLength}/30</p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div>
                  <p className="text-right text-gray-400">{bioLength}/150</p>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <div className="flex justify-between">
                  <FormMessage className="w-full" />
                  <p className="text-right w-full text-gray-400">
                    {usernameLength}/30
                  </p>
                </div>
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditForm;
