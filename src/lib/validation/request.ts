import { z } from "zod";

const emailSchema = z.email();
const phoneSchema = z.string().regex(/^\+?[0-9 ()-]{7,20}$/);

export const requestSchema = z.object({
  recipientContact: z
    .string()
    .trim()
    .refine(
      (value) =>
        emailSchema.safeParse(value).success ||
        phoneSchema.safeParse(value).success,
      "Enter a valid email or phone number"
    ),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  note: z.string().trim().max(140, "Note must be 140 characters or less").optional(),
});
