
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../lib/connectDB';
import Club from '../../../models/Club';
import { authMiddleware } from '../../../lib/authMiddleware';

export async function POST(req) {
  try {
    await connectDB();

    const user = await authMiddleware(); // ✅ Auth via token cookie
    const userId = user._id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    // Find clubs where logged-in user is the admin
    const clubs = await Club.find(
  {
    $or: [
      { adminId: userId },             // clubs where user is admin
      { members: userId }              // clubs where user is member
    ]
  },
  'name description adminId members books createdAt'
)

    .populate('adminId', 'name')         // populate admin name (optional, you already know)
    // .populate('members', 'name')         // populate members' names

    // Map to desired response format
    const response = clubs.map(club => ({
      _id: club._id,
      name: club.name,
      description: club.description,
      admin: club.adminId,               // {_id, name}
     membersCount: club.members.length,
      booksCount: club.books.length,
      createdAt: club.createdAt,
    }));

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error fetching clubs where user is admin:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
