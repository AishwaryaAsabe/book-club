// import { connectDB } from '../../../lib/connectDB';
// import User from '../../../models/User';
// import { comparePassword } from '../../../lib/hash';
// import { generateToken } from '../../../lib/auth';
// import { NextResponse } from 'next/server';
// import { serialize } from 'cookie';

// export async function POST(req) {
//   await connectDB();
//   const { email, password } = await req.json();

//   const user = await User.findOne({ email });
//   if (!user) 
//     return NextResponse.json({ error: 'Invalid email' }, { status: 401 });

//   const match = await comparePassword(password, user.password);
//   if (!match) 
//     return NextResponse.json({ error: 'Wrong password' }, { status: 401 });

//   const token = generateToken(user);

//   // Set HttpOnly cookie with token
//   const cookie = serialize('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     path: '/',
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//   });

//   return NextResponse.json(
//     { user: { id: user._id, email: user.email } }, 
//     { status: 200, headers: { 'Set-Cookie': cookie } }
//   );
// }


import { connectDB } from '../../../lib/connectDB';
import User from '../../../models/User';
import { comparePassword } from '../../../lib/hash';
import { generateToken } from '../../../lib/auth';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) 
    return NextResponse.json({ error: 'Invalid email' }, { status: 401 });

  const match = await comparePassword(password, user.password);
  if (!match) 
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });

  const token = generateToken(user);

  // Replace the existing cookie code with this:
  return NextResponse.json(
    { 
      user: { 
        id: user._id, 
        email: user.email,
        name: user.name,
        avatar: user.avatar 
      } 
    }, 
    { 
      status: 200, 
      headers: { 
        'Set-Cookie': [
          // Secure HttpOnly cookie (for API auth)
          serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
          }),
          // Non-HttpOnly cookie (for client-side access)
          serialize('client-token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost'
          })
        ],
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': req.headers.get('origin') || '*'
      } 
    }
  );
}