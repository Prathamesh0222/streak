import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Username must be atleast 3 characters")
    .max(20, "Username must not be more than 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    }),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const habitSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  category: z
    .string()
    .max(50, "Category must be less than 50 characters")
    .optional(),
  status: z.enum(["COMPLETED", "PENDING", "ONGOING"]).default("PENDING"),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).default("DAILY"),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type HabitInput = z.infer<typeof habitSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
