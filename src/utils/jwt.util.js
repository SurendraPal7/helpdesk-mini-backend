import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'change_this_to_a_strong_secret';
export default {
  sign: (payload) => jwt.sign(payload, SECRET, { expiresIn: '12h' }),
  verify: (token) => jwt.verify(token, SECRET)
};
