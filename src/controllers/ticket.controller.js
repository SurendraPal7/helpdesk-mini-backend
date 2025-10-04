import Ticket from '../models/Ticket.js';
import Timeline from '../models/Timeline.js';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

const makeError = (code, field, message) => ({ error: { code, field, message } });

async function checkAndMarkBreach(ticket) {
  const now = new Date();
  if (ticket.slaDeadline && now > ticket.slaDeadline && !ticket.slaBreached) {
    ticket.slaBreached = true;
    await ticket.save();
    await Timeline.create({ ticketId: ticket._id, action: 'sla_breached', data: { slaDeadline: ticket.slaDeadline } });
  }
}

export const createTicket = async (req, res) => {
  const { title, description, sla_hours, priority } = req.body;
  if (!title) return res.status(400).json(makeError('FIELD_REQUIRED','title','Title required'));
  if (!description) return res.status(400).json(makeError('FIELD_REQUIRED','description','Description required'));

  const ticket = await Ticket.create({
    title,
    description,
    slaHours: sla_hours || 24,
    priority: priority || 'normal',
    requesterId: req.user.userId
  });
  await Timeline.create({ ticketId: ticket._id, actorId: req.user.userId, action: 'created_ticket' });
  res.status(201).json(ticket);
};

export const listTickets = async (req, res) => {
  const { limit = 20, offset = 0, q, assignee, status, breached } = req.query;
  const lim = Math.min(100, parseInt(limit, 10) || 20);
  const off = parseInt(offset, 10) || 0;

  const filter = {};
  if (req.user.role === 'user') filter.requesterId = req.user.userId;
  if (assignee) filter.assigneeId = assignee;
  if (status) filter.status = status;
  if (q) filter.$text = { $search: q };

  let items = await Ticket.find(filter).sort({ createdAt: -1 }).skip(off).limit(lim).exec();

  for (const t of items) { await checkAndMarkBreach(t); }

  if (typeof breached !== 'undefined') {
    const want = breached === 'true' || breached === true;
    items = items.filter(i => !!i.slaDeadline && (new Date(i.slaDeadline) < new Date()) === want);
  }

  const next_offset = items.length < lim ? null : off + items.length;
  res.json({ items, next_offset });
};

export const getTicket = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json(makeError('FIELD_REQUIRED','id','Invalid id'));
  const ticket = await Ticket.findById(id);
  if (!ticket) return res.status(404).json(makeError('NOT_FOUND','id','Ticket not found'));

  if (req.user.role === 'user' && ticket.requesterId.toString() !== req.user.userId) {
    return res.status(403).json(makeError('FORBIDDEN',null,'Access denied'));
  }

  await checkAndMarkBreach(ticket);
  const comments = await Comment.find({ ticketId: ticket._id }).sort({ createdAt: 1 }).lean();
  const timeline = await Timeline.find({ ticketId: ticket._id }).sort({ createdAt: 1 }).lean();

  res.json({ ticket, comments, timeline });
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json(makeError('FIELD_REQUIRED','id','Invalid id'));
  const ticket = await Ticket.findById(id);
  if (!ticket) return res.status(404).json(makeError('NOT_FOUND','id','Ticket not found'));

  if (req.user.role === 'user') return res.status(403).json(makeError('FORBIDDEN',null,'Only agents/admins can update'));

  const ifMatch = req.header('If-Match') || req.body.version;
  if (!ifMatch) return res.status(400).json(makeError('FIELD_REQUIRED','version','Version required'));
  const clientVersion = parseInt(ifMatch, 10);
  if (clientVersion !== ticket.version) return res.status(409).json(makeError('VERSION_MISMATCH',null,'stale update'));

  const allowed = ['title','description','assigneeId','status','priority','slaHours'];
  let changed = false;
  for (const k of allowed) {
    if (typeof req.body[k] !== 'undefined') { ticket[k] = req.body[k]; changed = true; }
  }
  if (req.body.slaHours) ticket.slaDeadline = new Date(Date.now() + ticket.slaHours * 3600 * 1000);

  if (changed) {
    ticket.version += 1;
    await ticket.save();
    await Timeline.create({ ticketId: ticket._id, actorId: req.user.userId, action: 'updated_ticket', data: req.body });
  }
  res.json(ticket);
};
