import express from 'express';
import { 
  createTicket, 
  listTickets, 
  getTicket, 
  updateTicket   
} from '../controllers/ticket.controller.js';
import { addComment } from '../controllers/comment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import idempotencyMiddleware from '../middlewares/idempotency.middleware.js';

const router = express.Router();

// Create a new ticket
router.post('/', authMiddleware, idempotencyMiddleware, createTicket);

// Get all tickets (with pagination and search)
router.get('/', authMiddleware, listTickets);

// Get single ticket by ID
router.get('/:id', authMiddleware, getTicket);

// Update a ticket (status, assignment, etc.)
router.patch('/:id', authMiddleware, updateTicket);

// Add comment to a ticket
router.post('/:id/comments', authMiddleware, addComment);

export default router;
