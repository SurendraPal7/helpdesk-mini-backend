import IdempotencyKey from '../models/IdempotencyKey.js';

export default async function idempotencyMiddleware(req, res, next) {
  const key = req.header('Idempotency-Key');
  if (!key) return next();
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Authentication required for idempotency' } });

  const existing = await IdempotencyKey.findOne({ userId, key }).exec();
  if (existing) return res.status(existing.statusCode || 200).json(existing.response);

  const originalJson = res.json.bind(res);
  let capturedStatus = 200;
  res.status = (code) => { capturedStatus = code; return res; };
  res.json = async (body) => {
    try { await IdempotencyKey.create({ userId, key, response: body, statusCode: capturedStatus }); } catch (e) {}
    return originalJson(body);
  };
  next();
}
