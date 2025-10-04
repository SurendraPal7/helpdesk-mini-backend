const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_PER_MIN || '60', 10);
const WINDOW_MS = 60 * 1000;
const stores = new Map();

export default (req, res, next) => {
  const now = Date.now();
  const key = req.header('Authorization')?.slice(7) || req.ip;
  const entry = stores.get(key) || { count: 0, expires: now + WINDOW_MS };
  if (entry.expires < now) { entry.count = 0; entry.expires = now + WINDOW_MS; }
  entry.count += 1;
  stores.set(key, entry);
  if (entry.count > RATE_LIMIT) return res.status(429).json({ error: { code: 'RATE_LIMIT' } });
  next();
};
