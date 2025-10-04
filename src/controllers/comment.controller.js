import Comment from '../models/Comment.js';
import Ticket from '../models/Ticket.js';
import Timeline from '../models/Timeline.js';

const makeError = (code, field, message) => ({ error: { code, field, message } });

export const addComment = async (req, res) => {
  const ticketId = req.params.id;
  const { parent_id, body } = req.body;
  if (!body) return res.status(400).json(makeError('FIELD_REQUIRED','body','Body required'));

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return res.status(404).json(makeError('NOT_FOUND','ticketId','Ticket not found'));

  if (req.user.role === 'user' && ticket.requesterId.toString() !== req.user.userId) {
    return res.status(403).json(makeError('FORBIDDEN',null,'Access denied'));
  }

  const comment = await Comment.create({ ticketId, parentId: parent_id || null, authorId: req.user.userId, body });
  ticket.latestCommentText = body;
  await ticket.save();

  await Timeline.create({ ticketId: ticket._id, actorId: req.user.userId, action: 'added_comment', data: { commentId: comment._id } });

  res.status(201).json(comment);
};
