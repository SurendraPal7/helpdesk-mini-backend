import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // at the top of the file

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','agent','admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default model('User', UserSchema);
