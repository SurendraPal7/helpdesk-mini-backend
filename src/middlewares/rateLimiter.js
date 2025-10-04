// Simple in-memory rate limiter per user or per IP if unauthenticated
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_PER_MIN || '60', 10);
const WINDOW_MS = 60 * 1000;


const stores = new Map(); // key -> { count, expires }


module.exports = (req, res, next) => {
try {
const now = Date.now();
const userKey = (() => {
const auth = req.header('Authorization');
if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
return req.ip;
})();


const entry = stores.get(userKey) || { count: 0, expires: now + WINDOW_MS };
if (entry.expires < now) {
entry.count = 0;
entry.expires = now + WINDOW_MS;
}
entry.count += 1;
stores.set(userKey, entry);
if (entry.count > RATE_LIMIT) {
return res.status(429).json({ error: { code: 'RATE_LIMIT' } });
}
next();
} catch (err) { next(err); }
};
