"use client";

import { z } from "zod";

export const notificationSchema = z.object({
  messages: z.boolean(),
});

export type NotificationFormInputs = z.infer<typeof notificationSchema>;
