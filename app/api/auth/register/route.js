import { connectDB } from '../../../lib/connectDB';
import User from '../../../models/User';
import { hashPassword } from '../../../lib/hash';
import { generateToken } from '../../../lib/auth';


export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing) return Response.json({ error: 'User already exists' }, { status: 400 });

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed });
  
  const token = generateToken(user._id);

  return Response.json({ success: true, user: { id: user._id, email: user.email } ,token},
      { status: 201 }

  );
  
}
