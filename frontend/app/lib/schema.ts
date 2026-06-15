import { PriorityStatus, ProjectStatus, RoleStatus, TaskStatus } from '@/types';
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email("Невірний формат електронної пошти"),
  password: z.string().min(6, "Пароль повинен містити принаймні 6 символів"),
});

export const signUpSchema = z.object({
  name: z.string().min(3, "Ім'я повинно містити принаймні 2 символи"),
  email: z.string().email("Невірний формат електронної пошти"),
  password: z.string().min(6, "Пароль повинен містити принаймні 6 символів"),
  confirmPassword: z.string().min(6, "Пароль повинен містить принаймні 6 символів"),
}).refine((data) => data.password === data.confirmPassword, { message: "Паролі не співпадають", path: ["confirmPassword"] });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Невірний формат електронной почты"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Пароль повинен містить принаймні 6 символів"),
  confirmNewPassword: z.string().min(6, "Пароль повинен містить принаймні 6 символів"),
}).refine((data) => data.newPassword === data.confirmNewPassword, { message: "Паролі не співпадают", path: ["confirmNewPassword"] });

export const workspaceSchema = z.object({
  name: z.string().min(3, "Ім'я повинно містити принаймні 2 символи"),
  color: z.string().min(3, "Не вірний формат кольору"),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Ім'я повинно містити принаймні 2 символи"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.string().min(6, "Невірний формат дати"),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
  members: z.array(z.object({ user: z.string(), role: z.nativeEnum(RoleStatus), })
  ).min(1, "Необхідно вибрати хоча б одного учасника"),
});

export const createTaskSchema = z.object({
  title: z.string().min(2, "Назва повинно містити принаймні 2 символи"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(PriorityStatus),
  dueDate: z.string().min(6, "Невірний формат дати"),
  assignees: z.array(z.string()).min(1, "Потрібен принаймні один виконавець"),
});