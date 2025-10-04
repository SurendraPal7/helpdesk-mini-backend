import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const TicketSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assigneeId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  priority: { type: String, enum: ['low','normal','high','urgent'], default: 'normal' },
  status: { type: String, enum: ['open','in_progress','resolved','closed'], default: 'open' },
  slaHours: { type: Number, default: 24 },
  slaDeadline: { type: Date },
  slaBreached: { type: Boolean, default: false },
  latestCommentText: { type: String, default: '' },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// text index for search
TicketSchema.index({ title: 'text', description: 'text', latestCommentText: 'text' });

TicketSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (!this.slaDeadline) this.slaDeadline = new Date(Date.now() + this.slaHours * 3600 * 1000);
  next();
});

export default model('Ticket', TicketSchema);
