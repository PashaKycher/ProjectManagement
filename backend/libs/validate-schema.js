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

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Токен скидування пароля обов'язковий"),
  newPassword: z.string().min(6, "Новий пароль повинен містити принаймні 6 символів"),
  confirmNewPassword: z.string().min(6, "Подтверждение пароля должно содержать не менее 6 символов"),
});

const emailSchema = z.object({
  email: z.string().email("Невірний формат електронної пошти"),
});

const workspaceSchema = z.object({
  name: z.string().min(3, "Ім'я повинно містити принаймні 3 символи"),
  color: z.string().min(3, "Не вірний формат кольору"),
  description: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(3, "Назва повинно містити принаймні 3 символи"),
  description: z.string().optional(),
  status: z.enum(["Planning", "In Progress", "On Hold", "Completed", "Cancelled"]),
  startDate: z.string(),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
  members: z.array(
    z.object({
      user: z.string(),
      role: z.enum(["admin", "member", "owner", "viewer"]),
    })
  ).optional(),
});

const taskSchema = z.object({
  title: z.string().min(2, "Назва повинно містити принаймні 2 символи"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Review", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().min(3, "Невірний формат дати"),
  assignees: z.array(z.string()).min(1, "Потрібен принаймні один виконавець"),
});

export { registerSchema, loginSchema, verifyEmailSchema, resetPasswordSchema, emailSchema, workspaceSchema, projectSchema, taskSchema };