"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import useSavePushToken from "@/hooks/useSavePushToken";
import { requestNotificationPermission } from "@/lib/firebase/requestNotificationPermission";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  NotificationFormInputs,
  notificationSchema,
} from "@/schemas/notificationSchemas";
import { Spinner } from "@/components/ui/spinner";

const NotificationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { saveToken, loading } = useSavePushToken();

  const form = useForm<NotificationFormInputs>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      messages: true,
    },
  });

  const onSubmit: SubmitHandler<NotificationFormInputs> = async (data) => {
    setErrorMessage(null);
    console.log("Form data:", data);

    try {
      const token = await requestNotificationPermission();

      if (!token) {
        setErrorMessage("Failed to enable notifications. Please try again.");
        return;
      }

      const result = await saveToken(token);

      if (!result.success) {
        setErrorMessage(
          "Failed to save notification settings. Please try again later."
        );
        return;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const onSend = async () => {
    const content = "This is a test notification";

    try {
      const response = await fetch("http://localhost:3000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "sendNotification",
          recipientId: "test",
          title: "New Message",
          body: content,
        }),
      });

      if (response.ok) {
        console.log("Notification sent successfully");
      } else {
        console.error("Failed to send notification:", await response.text());
      }
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {errorMessage && (
        <Alert>
          <AlertCircle color="red" className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="messages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Messages</FormLabel>
                      <FormDescription>
                        Get notified when someone sends messages.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            Save
          </Button>
        </form>
      </Form>

      {/* Test */}
      <Button onClick={onSend}>Send Notification</Button>
    </div>
  );
};

export default NotificationForm;
