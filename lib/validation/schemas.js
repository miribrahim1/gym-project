import { z } from "zod";

const phoneRegex = /^[+]?[\d\s\-()]{7,17}$/;

export const nameField = z.string().trim().min(2, "Please enter at least 2 characters").max(80);
export const emailField = z.string().trim().min(1, "Email is required").email("Enter a valid email address");
export const phoneField = z.string().trim().regex(phoneRegex, "Enter a valid phone number");

export const contactFormSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

export const membershipSignupSchema = z.object({
  planSlug: z.string().min(1, "Choose a plan"),
  billingCycleId: z.string().min(1, "Choose a billing cycle"),
  startDate: z.string().min(1, "Choose a start date"),
  fullName: nameField,
  email: emailField,
  phone: phoneField,
  fitnessGoal: z.string().min(1, "Select a fitness goal"),
  price: z.number().positive(),
});

export const classBookingSchema = z.object({
  sessionId: z.string().min(1),
  name: nameField,
  email: emailField,
  phone: phoneField,
});

export const ptBookingSchema = z.object({
  trainerSlug: z.string().min(1, "Choose a trainer"),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  name: nameField,
  email: emailField,
  phone: phoneField,
  goal: z.string().min(1, "Tell us your goal"),
  notes: z.string().max(400).optional().or(z.literal("")),
});

export const consultationBookingSchema = z.object({
  nutritionistSlug: z.string().min(1, "Choose a nutritionist"),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  name: nameField,
  email: emailField,
  phone: phoneField,
  goal: z.string().min(1, "Tell us your goal"),
});

export const eventRegistrationSchema = z.object({
  eventSlug: z.string().min(1),
  name: nameField,
  email: emailField,
  phone: phoneField,
  guests: z.coerce.number().int().min(0).max(6),
});

export const checkoutSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  address: z.string().trim().min(10, "Enter your full delivery address").max(240),
  city: z.string().trim().min(2, "City is required").max(60),
  pincode: z.string().trim().regex(/^\d{4,8}$/, "Enter a valid postal code"),
});

export const adminLoginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export function parseFormData(schema, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    const fieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, errors: fieldErrors, values: raw };
  }
  return { success: true, data: result.data };
}
