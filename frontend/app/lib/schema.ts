import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email("Невірний формат електронної пошти"),
  password: z.string().min(6, "Пароль повинен містити принаймні 6 символів"),
});

export const signUpSchema = z.object({
  email: z.string().email("Невірний формат електронної пошти"),
  password: z.string().min(6, "Пароль повинен містити принаймні 6 символів"),
  name: z.string().min(3, "Ім'я повинно містити принаймні 2 символи"),
  confirmPassword: z.string().min(6, "Пароль повинен містить принаймні 6 символів"),
})
  .refine((data) => data.password === data.confirmPassword, { message: "Паролі не співпадають", path: ["confirmPassword"] });