import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.email({ error: "Invalid Email" }).trim(),
  password: z
    .string()
    .min(3, { error: "Password must have atleast 3 characters" }),
  name: z.string(),
});

export const SignInSchema = z.object({
  email: z.email({ error: "Invalid Email" }).trim(),
  password: z
    .string()
    .min(3, { error: "Password must have atleast 3 characters" }),
});
