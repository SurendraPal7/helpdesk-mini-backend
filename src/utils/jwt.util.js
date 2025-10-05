import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Use JWT_SECRET from environment variable
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('JWT_SECRET is not defined in .env');
}

// Sign JWT token
export const sign = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '12h' });
};

// Verify JWT token
export const verify = (token) => {
  return jwt.verify(token, SECRET);
};
