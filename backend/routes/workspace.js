import express from 'express';
import { workspaceSchema } from '../libs/validate-schema.js';
import { validateRequest } from 'zod-express-middleware';
import  authMiddlaware  from '../middleware/auth-maddleware.js';
import { createWorkspace, getWorkspaces } from '../controllers/workspace-controller.js';

const router = express.Router();

router.get('/', authMiddlaware, getWorkspaces);
router.post('/', authMiddlaware, validateRequest({ body: workspaceSchema }), createWorkspace);

export default router