import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware"
import { createTask } from "../controllers/task-controller.js";
import authMiddlaware from "../middleware/auth-maddleware.js";
import { taskSchema } from "../libs/validate-schema.js";

const router = express.Router();

router.post("/:projectId/create-task", authMiddlaware, validateRequest({ params: z.object({ projectId: z.string() }), body: taskSchema }), createTask);

export default router 