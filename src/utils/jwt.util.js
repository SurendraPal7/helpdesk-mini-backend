// utils/jwt.util.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET not defined in .env");

export const sign = (payload) => jwt.sign(payload, SECRET, { expiresIn: '12h' });
export const verify = (token) => jwt.verify(token, SECRET);
