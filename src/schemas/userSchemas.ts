"use client";

import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  userName: z.string().min(3, "Username is required"),
});

export type UserFormInputs = z.infer<typeof userSchema>;
