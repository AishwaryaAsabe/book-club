import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT token
export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET); // must match how you created the token
}



export function getUserFromCookie(token) {
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}