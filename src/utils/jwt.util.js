
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Read JWT secret from environment
const SECRET = process.env.JWT_SECRET;

// Throw error immediately if secret is missing
if (!SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

/**
 * Sign a JWT token
 * @param {Object} payload - The payload to include in the token
 * @returns {string} JWT token
 */
export const sign = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '12h' });
};

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verify = (token) => {
  return jwt.verify(token, SECRET);
};
