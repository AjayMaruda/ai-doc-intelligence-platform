import { z } from 'zod';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters long',
    })
    .regex(passwordRegex, {
      message:
        'Password must contain at least one uppercase, lowercase, number and special character',
    }),
});

export const loginSchema = registerSchema;
