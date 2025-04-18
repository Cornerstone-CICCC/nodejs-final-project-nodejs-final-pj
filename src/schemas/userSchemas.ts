"use client";

import { z } from "zod";

export const userSchema = z.object({
  name: z.string().nonempty("Name is required").min(3, "Name must be 3-30 characters").max(30, "Name must be 3-30 characters"),
  bio: z.string().max(150, "Bio must be under 150 characters").optional(),
});

export type UserFormInputs = z.infer<typeof userSchema>;
