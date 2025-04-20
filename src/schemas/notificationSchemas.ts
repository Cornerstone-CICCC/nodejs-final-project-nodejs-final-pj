"use client";

import { z } from "zod";

export const notificationSchema = z.object({
  all: z.boolean(),
  messages: z.boolean(),
});

export type NotificationFormInputs = z.infer<typeof notificationSchema>;
