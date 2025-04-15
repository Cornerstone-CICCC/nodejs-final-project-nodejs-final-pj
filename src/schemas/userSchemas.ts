"use client";

import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Name is required").max(30, "Name needs to be under 30 characters"),
  bio: z.string().max(150, "Bio have to be under 150 characters"),
  userName: z.string().min(3, "Username is required").max(30, "Username needs to be under 30 characters"),
});

export type UserFormInputs = z.infer<typeof userSchema>;
