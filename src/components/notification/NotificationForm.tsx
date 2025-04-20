"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
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
import useNotificationSettings from "@/hooks/useNotificationSettings";
import { sendNotificationAPI } from "@/lib/firebase/notifications";

const NotificationForm = () => {
  const { saveToken } = useSavePushToken();
  const { settings, loading, error, updateSettings } =
    useNotificationSettings();

  const form = useForm<NotificationFormInputs>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      all: false,
      messages: false,
    },
  });

  useEffect(() => {
    if (settings) {
      const initialValues = {
        all: settings?.notificationsEnabled || false,
        messages: settings?.notificationTypes.messages || false,
      };
      form.reset(initialValues);
    }
  }, [settings, form]);

  const onSubmit: SubmitHandler<NotificationFormInputs> = async (data) => {
    try {
      if (!settings || !settings.id) {
        throw new Error("Settings or ID is not available");
      }

      const updatedSettings = {
        ...settings,
        notificationsEnabled: data.all,
        notificationTypes: {
          ...settings?.notificationTypes,
          messages: data.messages,
        },
      };

      await updateSettings(updatedSettings);
    } catch (error) {
      console.error(error);
    }
  };

  // Marked for deletion↓
  const onSend = async () => {
    const token = await requestNotificationPermission();
    if (!token) {
      return;
    }

    const result = await saveToken(token);

    if (!result.success) {
      return;
    }

    try {
      const payload = {
        type: "sendNotification",
        recipientId: "12345",
        title: "New Message",
        body: "This is a test notification",
      };

      const success = await sendNotificationAPI(payload);

      if (success) {
        console.log("Notification sent successfully");
      } else {
        console.error("Failed to send notification.");
      }
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {error && (
        <Alert>
          <AlertCircle color="red" className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
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
                name="all"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center">
                    <div className="space-y-0.5">
                      <FormLabel>Pause all</FormLabel>
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
          <Button className="w-full" type="submit">
            Save
          </Button>
        </form>
      </Form>

      {/* Marked for deletion */}
      <Button onClick={onSend}>Send Notification</Button>
    </div>
  );
};

export default NotificationForm;
