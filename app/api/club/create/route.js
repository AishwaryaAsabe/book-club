import { NextResponse } from 'next/server';
import Club from '../../../models/Club';
import { connectDB } from '../../../lib/connectDB';
import { authMiddleware } from '../../../lib/authMiddleware';

export async function POST(req) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const { name, description ,category} = await req.json();

  if (!name || !description || !category) {
    return NextResponse.json({ error: 'Name and description required' }, { status: 400 });
  }

  const existingClub = await Club.findOne({ name: name.trim() });
  if (existingClub) {
    return NextResponse.json({ error: 'Club name already taken' }, { status: 400 });
  }

  const newClub = new Club({
    name: name.trim(),
    description,
    adminId: user.id,
    members: [user.id],
    books: [],
    category
    // imageUrl: imageUrl || '/default-club.png',  // <-- add this line

  });

  await newClub.save();

  return NextResponse.json({ message: 'Club created', club: newClub }, { status: 201 });
}
