import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const eventCreateSchema = z.object({
  title: z.string().min(1, "Event title is required").max(200),
  description: z.string().max(2000).optional(),
  event_date: z.string().optional(),
  event_end_date: z.string().optional(),
  location_name: z.string().max(200).optional(),
  location_address: z.string().max(500).optional(),
  design_url: z.string().optional(),
  design_type: z.enum(["image", "pdf", "upload"]).default("upload"),
  customization: z
    .object({
      primaryColor: z.string().default("#7c3aed"),
      backgroundColor: z.string().default("#ffffff"),
      backgroundImage: z.string().nullable().default(null),
      fontFamily: z.string().default("Inter"),
      buttonStyle: z.enum(["rounded", "pill", "square"]).default("rounded"),
      showCountdown: z.boolean().default(true),
    })
    .optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const eventUpdateSchema = eventCreateSchema.partial();

export const rsvpFieldSchema = z.object({
  field_name: z.string().min(1),
  field_label: z.string().min(1),
  field_type: z.enum([
    "attendance",
    "text",
    "select",
    "multiselect",
    "number",
    "email",
    "phone",
  ]),
  options: z.array(z.string()).nullable().optional(),
  placeholder: z.string().nullable().optional(),
  is_required: z.boolean().default(false),
  is_enabled: z.boolean().default(true),
  sort_order: z.number().default(0),
});

export const guestSchema = z.object({
  name: z.string().min(1, "Guest name is required").max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export const rsvpSubmissionSchema = z.object({
  respondent_name: z.string().min(1, "Your name is required"),
  respondent_email: z.string().email().optional().or(z.literal("")),
  status: z.enum(["attending", "not_attending", "maybe"]),
  headcount: z.number().min(1).max(50).default(1),
  response_data: z.record(z.string(), z.unknown()).default({}),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;
export type GuestInput = z.infer<typeof guestSchema>;
export type RSVPSubmissionInput = z.infer<typeof rsvpSubmissionSchema>;
