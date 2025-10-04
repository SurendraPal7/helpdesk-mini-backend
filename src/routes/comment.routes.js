import express from 'express';
import { addComment } from '../controllers/comment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import idempotencyMiddleware from '../middlewares/idempotency.middleware.js';

const router = express.Router();

// POST /api/tickets/:id/comments
router.post('/:id/comments', authMiddleware, idempotencyMiddleware, addComment);

export default router;
