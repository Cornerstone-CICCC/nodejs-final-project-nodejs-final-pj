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
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      userName: user?.userName || "",
      bio: user?.bio || "",
    },
  });

  // const userId = user?.id

  const onSubmit = async (data: UserFormInputs) => {
    console.log("Form submitted:", data);
    console.log("Uploaded image:", uploadedImage);

    setLoading(true)

    // await new Promise((resolve) => setTimeout(resolve, 4000))

    try {
      const res = await fetch(`/app/api/users/123`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          email: user?.email,
          fileid: uploadedImage ? "" : user?.fileId
        })
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.message || "error")
      }

    } catch (err) {
      console.log(err, "failed editing")
      setShowError(true)
    } finally {
      setLoading(false)
    }
  };

  const bioValue = form.watch("bio")
  const bioLength = bioValue?.length || 0

  return (
    <div className="flex flex-col gap-10">
      <Alert className={showError ? "" : "hidden"}>
        <AlertCircle color="red" className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to update your profile. Please try again later.
        </AlertDescription>
      </Alert>

      <ImageUpload onFileSelect={setUploadedImage} />
      
      {loading && <div className="fixed top-0 left-0 w-screen h-screen bg-white/70 flex justify-center items-center"><p className="text-xl">Loading...</p></div>}

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
