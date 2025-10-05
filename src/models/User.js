import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Method to verify password
UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Optional: hash password before saving (if you want to save raw passwords safely)
// UserSchema.pre('save', async function(next) {
//   if (this.isModified('passwordHash')) {
//     this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
//   }
//   next();
// });

const User = model('User', UserSchema);

export default User;
