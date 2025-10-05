import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'abc123';

export const sign = (payload) => jwt.sign(payload, SECRET, { expiresIn: '12h' });
export const verify = (token) => jwt.verify(token, SECRET);
