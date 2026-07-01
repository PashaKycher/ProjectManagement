import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware"
import { achievedTask, addComment, createSubTask, createTask, getCommentsByTaskId, getTaskActivity, getTaskById, updateSubTask, updateTaskAssignees, updateTaskDescription, updateTaskPriority, updateTaskStatus, updateTaskTitle, watchTask } from "../controllers/task-controller.js";
import authMiddlaware from "../middleware/auth-maddleware.js";
import { taskSchema } from "../libs/validate-schema.js";

const router = express.Router();

router.post("/:projectId/create-task", authMiddlaware, validateRequest({ params: z.object({ projectId: z.string() }), body: taskSchema }), createTask);
router.post("/:taskId/watch", authMiddlaware, validateRequest({params: z.object({taskId: z.string()})}), watchTask);
router.post("/:taskId/achieved",authMiddlaware, validateRequest({params: z.object({taskId: z.string()})}), achievedTask);
router.get("/:taskId", authMiddlaware, validateRequest({params: z.object({taskId: z.string()})}), getTaskById);
router.put("/:taskId/title", authMiddlaware, validateRequest({params: z.object({taskId: z.string()}), body: z.object({title: z.string()})}), updateTaskTitle);
router.put("/:taskId/status", authMiddlaware, validateRequest({params: z.object({taskId: z.string()}), body: z.object({status: z.string()})}), updateTaskStatus);
router.put("/:taskId/description", authMiddlaware, validateRequest({params: z.object({taskId: z.string()}), body: z.object({description: z.string()})}), updateTaskDescription);
router.put("/:taskId/assignees", authMiddlaware, validateRequest({params: z.object({taskId: z.string()}), body: z.object({assignees: z.array(z.string())})}), updateTaskAssignees);
router.put("/:taskId/priority", authMiddlaware, validateRequest({params: z.object({taskId: z.string()}), body: z.object({priority: z.string()})}), updateTaskPriority);

router.post("/:taskId/add-subtask", authMiddlaware, validateRequest({params: z.object({taskId: z.string()}), body: z.object({title: z.string()})}), createSubTask);
router.put("/:taskId/update-subtask/:subTaskId", authMiddlaware, validateRequest({params: z.object({taskId: z.string(), subTaskId: z.string()}), body: z.object({completed: z.boolean()})}), updateSubTask);

router.get("/:resourceId/activity", authMiddlaware, validateRequest({params: z.object({resourceId: z.string()})}), getTaskActivity);

router.get("/:taskId/comments", authMiddlaware, validateRequest({params: z.object({taskId: z.string()})}), getCommentsByTaskId);
router.post("/:taskId/add-comment", authMiddlaware, validateRequest({params: z.object({taskId: z.string()}), body: z.object({text: z.string()})}), addComment);

export default router 