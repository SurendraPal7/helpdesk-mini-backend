import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import './src/config/db.js'; // connect to DB
import authRoutes from './src/routes/auth.routes.js';
import ticketRoutes from './src/routes/ticket.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import rateLimiter from './src/middlewares/rateLimiter.middleware.js';

const PORT = process.env.PORT || 8000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimiter);

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);      // includes /:id and GET list
app.use('/api/tickets', commentRoutes);     // mounts POST /:id/comments

app.get('/', (req, res) => res.json({ message: 'HelpDesk Mini API' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
