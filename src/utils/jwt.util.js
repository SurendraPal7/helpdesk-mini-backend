import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'abc123';
export const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
export const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);
