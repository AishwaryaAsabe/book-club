import { cookies } from 'next/headers';
import { verifyToken } from './auth';
import User from '../models/User';
import { connectDB } from './connectDB';

export async function authMiddleware() {
  await connectDB();

  const cookieStore = await cookies();
const token = cookieStore.get('token')?.value;


  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }

  try {
    const decoded = verifyToken(token); // not async
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('Unauthorized: User not found');
    return user;
  } catch (err) {
    throw new Error('Unauthorized: Invalid token');
  }
}
