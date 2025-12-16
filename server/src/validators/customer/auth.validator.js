import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  fullName: z.string().min(1).optional(), // optional if you send fullName
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});
