import express from 'express';
import { workspaceSchema } from '../libs/validate-schema.js';
import { validateRequest } from 'zod-express-middleware';
import  authMiddlaware  from '../middleware/auth-maddleware.js';
import { createWorkspace, getWorkspaceById, getWorkspaceByIdProjects, getWorkspaces, getWorkspaceStats } from '../controllers/workspace-controller.js';

const router = express.Router();

router.get('/', authMiddlaware, getWorkspaces);
router.post('/', authMiddlaware, validateRequest({ body: workspaceSchema }), createWorkspace);
router.get('/:workspaceId', authMiddlaware, getWorkspaceById);
router.get('/:workspaceId/projects', authMiddlaware, getWorkspaceByIdProjects);
router.get('/:workspaceId/stats', authMiddlaware, getWorkspaceStats);

export default router