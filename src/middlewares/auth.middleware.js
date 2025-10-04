import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_to_a_strong_secret';

export default function authMiddleware(req, res, next) {
  const auth = req.header('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Authorization header required' } });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Invalid token' } });
  }
}
