import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import authMiddlaware from '../middleware/auth-maddleware.js';
import { projectSchema } from '../libs/validate-schema.js';
import { createProject, getProjectDitails, getProjectTasks } from '../controllers/project-controller.js';
import { z } from 'zod';

const router = express.Router();

router.post("/:workspaceId/create-project", authMiddlaware, validateRequest({ params: z.object({ workspaceId: z.string() }), body: projectSchema, }), createProject);
router.get("/:projectId", authMiddlaware, validateRequest({params: z.object({projectId: z.string()})}), getProjectDitails);
router.get("/:projectId/tasks", authMiddlaware, validateRequest({params: z.object({projectId: z.string()})}), getProjectTasks);

export default router