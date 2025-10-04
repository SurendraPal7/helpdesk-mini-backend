import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const IdempotencySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true },
  response: { type: Schema.Types.Mixed },
  statusCode: { type: Number },
  createdAt: { type: Date, default: Date.now }
});
IdempotencySchema.index({ userId: 1, key: 1 }, { unique: true });
export default model('IdempotencyKey', IdempotencySchema);
