import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { sign } from '../utils/jwt.util.js';

const makeError = (code, field, message) => ({ error: { code, field, message } });

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email) return res.status(400).json(makeError('FIELD_REQUIRED','email','Email is required'));
    if (!password) return res.status(400).json(makeError('FIELD_REQUIRED','password','Password is required'));

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json(makeError('FIELD_REQUIRED','email','Email already registered'));

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash: hash, role: role || 'user' });

    const token = sign({ userId: user._id.toString(), role: user.role });
    res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(makeError('FIELD_REQUIRED','email/password','Required'));

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json(makeError('NOT_FOUND','email','Invalid credentials'));

    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(400).json(makeError('NOT_FOUND','email','Invalid credentials'));

    const token = sign({ userId: user._id.toString(), role: user.role });
    res.json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};
