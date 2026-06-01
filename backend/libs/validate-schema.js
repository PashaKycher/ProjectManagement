import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(3, "Ім'я повинно містити принаймні 2 символи"),
  email: z.string().email("Невірний формат електронної пошти"),
  password: z.string().min(6, "Пароль повинен містити принаймні 6 символів"),
});

const loginSchema = z.object({
  email: z.string().email("Невірний формат електронної пошти"),
  password: z.string().min(6, "Пароль повинен містити принаймні 6 символів"),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Токен верифікації обов'язковий"),
});

export { registerSchema, loginSchema, verifyEmailSchema };