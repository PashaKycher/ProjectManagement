import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware"
import { createTask, getTaskById, updateTaskDescription, updateTaskTitle } from "../controllers/task-controller.js";
import authMiddlaware from "../middleware/auth-maddleware.js";
import { taskSchema } from "../libs/validate-schema.js";

const router = express.Router();

router.post("/:projectId/create-task", authMiddlaware, validateRequest({ params: z.object({ projectId: z.string() }), body: taskSchema }), createTask);
router.get("/:taskId", authMiddlaware, validateRequest({params: z.object({taskId: z.string()})}), getTaskById);
router.put("/:taskId/title", authMiddlaware, validateRequest({params: z.object({taskId: z.string()}), body: z.object({title: z.string()})}), updateTaskTitle);
router.put("/:taskId/description", authMiddlaware, validateRequest({params: z.object({taskId: z.string()}), body: z.object({description: z.string()})}), updateTaskDescription);

export default router 