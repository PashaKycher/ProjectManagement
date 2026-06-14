import { PriorityStatus, ProjectStatus, RoleStatus, TaskStatus } from "@/types";

export const publicRoutes = ["/", "/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/verify-email"];

export const statusTranslation = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.PLANNING:
      return "Планується"
    case ProjectStatus.IN_PROGRESS:
      return "В роботі"
    case ProjectStatus.ON_HOLD:
      return "На очікуванні"
    case ProjectStatus.COMPLETED:
      return "Завершено"
    case ProjectStatus.CANCELLED:
      return "Скасовано"
  }
}

export const roleTranslation = (role: string) => {
  switch (role) {
    case RoleStatus.ADMIN:
      return "Адміністратор"
    case RoleStatus.MEMBER:
      return "Учасник"
    case RoleStatus.OWNER:
      return "Власник"
    case RoleStatus.VIEWER:
      return "Переглядач"
  }
}

export const doItTranslation = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TO_DO:
      return "До виконання"
    case TaskStatus.IN_PROGRESS:
      return "В роботі"
    case TaskStatus.REVIEW:
      return "На перевірці"
    case TaskStatus.DONE:
      return "Завершено"
  }
}

export const priorityTranslation = (priority: PriorityStatus) => {
  switch (priority) {
    case PriorityStatus.LOW:
      return "Низький"
    case PriorityStatus.MEDIUM:
      return "Середній"
    case PriorityStatus.HIGH:
      return "Високий"
  }
}

export const getTaskStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.PLANNING:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
    case ProjectStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    case ProjectStatus.ON_HOLD:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    case ProjectStatus.COMPLETED:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    case ProjectStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
  }
}