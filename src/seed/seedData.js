import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import bcrypt from 'bcrypt';
import '../config/db.js';

async function seed() {
  const pw = 'password123';
  const hash = await bcrypt.hash(pw, 10);

  await User.deleteMany({});
  await Ticket.deleteMany({});

  const alice = await User.create({ email: 'alice@example.com', passwordHash: hash, role: 'user' });
  const agent = await User.create({ email: 'agent@example.com', passwordHash: hash, role: 'agent' });
  const admin = await User.create({ email: 'admin@example.com', passwordHash: hash, role: 'admin' });

  await Ticket.create({ title: 'Printer not working', description: 'Office printer fails', requesterId: alice._id, assigneeId: agent._id, slaHours: 24, priority: 'high' });

  console.log('Seeded: alice, agent, admin with password:', pw);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
