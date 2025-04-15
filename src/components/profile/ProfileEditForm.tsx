"use client";

import { UserFormInputs, userSchema } from "@/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const ProfileEditForm = () => {
  const { user } = useUserStore();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const form = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      userName: user?.userName || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    console.log("Form submitted:", data);
    console.log("Uploaded image:", uploadedImage);
  };

  const bioValue = form.watch("bio")
  console.log(bioValue)
  const bioLength = bioValue?.length || 0
  console.log(bioLength)

  return (
    <div className="flex flex-col gap-10">
      <Alert >
        <AlertCircle color="red" className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to update your profile. Please try again later.
        </AlertDescription>
      </Alert>

      <ImageUpload onFileSelect={setUploadedImage} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
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
                <FormMessage />
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
