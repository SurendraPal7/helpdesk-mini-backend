import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'abc123';
export default {
  sign: (payload) => jwt.sign(payload, SECRET, { expiresIn: '12h' }),
  verify: (token) => jwt.verify(token, SECRET)
};
