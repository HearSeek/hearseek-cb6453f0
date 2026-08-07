import { z } from "zod";

/** Shared client-side schemas for the public waitlist forms. */

export const consumerWaitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" })
    .max(254, { message: "Email must be less than 254 characters" }),
});

export const enterpriseWaitlistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Work email is required" })
    .email({ message: "Enter a valid email address" })
    .max(254, { message: "Email must be less than 254 characters" }),
  enterprise_name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your organization" })
    .max(150, { message: "Organization must be less than 150 characters" }),
  details: z
    .string()
    .trim()
    .max(1000, { message: "Please keep this under 1000 characters" }),
});

export type EnterpriseWaitlistInput = z.infer<typeof enterpriseWaitlistSchema>;

/** Flattens a ZodError into a `{ field: firstMessage }` map for inline display. */
export const fieldErrors = <T extends Record<string, unknown>>(
  error: z.ZodError<T>,
): Partial<Record<keyof T, string>> => {
  const out: Partial<Record<keyof T, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof T | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
};
