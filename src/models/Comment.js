import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model('Comment', CommentSchema);
