// lib/validation/auth.ts
import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

// Registration Schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s\-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
    
    // username: z
    //   .string()
    //   .min(1, "Username is required")
    //   .min(3, "Username must be at least 3 characters")
    //   .max(30, "Username must be less than 30 characters")
    //   .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    
    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[0-9\s\-\(\)]{10,15}$/.test(val),
        "Please enter a valid phone number"
      ),
    
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    
    agreeTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;