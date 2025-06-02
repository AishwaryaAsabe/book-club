import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../lib/connectDB';
import User from '../../../models/User';
import cloudinary from '../../../lib/cloundinary';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

if (!token) {
  return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
}


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
  }
}




export async function PUT(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const contentType = req.headers.get('content-type') || '';
    let data = {};
    let avatarUrl = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      data.name = formData.get('name');
      data.email = formData.get('email');
      data.bio = formData.get('bio');

      const file = formData.get('avatar');
      if (file && typeof file === 'object') {
        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'bookclub-profile-pics' },
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          ).end(buffer);
        });

        avatarUrl = result.secure_url;
      }
    } else {
      data = await req.json();
      avatarUrl = data.avatarUrl;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    user.name = data.name ?? user.name;
    user.email = data.email ?? user.email;
    user.bio = data.bio ?? user.bio;
    user.avatarUrl = avatarUrl ?? user.avatarUrl;

    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Invalid token or error' }, { status: 401 });
  }
}


