// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET;

// // Generate JWT token
// export function generateToken(user) {
//   return jwt.sign(
//     {
//       id: user._id,
//       email: user.email,
//       name: user.name,
//     },
//     JWT_SECRET,
//     { expiresIn: '7d' }
//   );
// }

// // Verify JWT token
// export function verifyToken(token) {
//   return jwt.verify(token, process.env.JWT_SECRET); // must match how you created the token
// }



// export function getUserFromCookie(token) {
//   if (!token) return null;
//   try {
//     return verifyToken(token);
//   } catch (error) {
//     return null;
//   }
// }



import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(), // Ensure ID is string
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('Token verification error:', err.message);
    throw new Error('Invalid token');
  }
}