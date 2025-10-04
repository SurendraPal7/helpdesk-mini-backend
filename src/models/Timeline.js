import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const TimelineSchema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  actorId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export default model('Timeline', TimelineSchema);
