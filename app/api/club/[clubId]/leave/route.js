// app/api/clubs/[clubId]/leave/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/connectDB';
import Club from '@/app/models/Club';
import { authMiddleware } from '@/app/lib/authMiddleware';

export async function POST(req, { params }) {
  await connectDB();
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { clubId } = params;

  try {
    const club = await Club.findById(clubId);
    if (!club) return NextResponse.json({ error: 'Club not found' }, { status: 404 });

    // Check if user is a member
    if (!club.members.includes(user.id)) {
      return NextResponse.json({ error: 'You are not a member of this club' }, { status: 403 });
    }

    // Prevent admin from leaving
    if (club.adminId.toString() === user.id) {
      return NextResponse.json({ error: 'Admin cannot leave their own club' }, { status: 403 });
    }

    // Remove user from members
    club.members = club.members.filter(memberId => memberId.toString() !== user.id);

     if (club.members.length === 0) {
      await Club.findByIdAndDelete(clubId);
      return NextResponse.json({ message: 'You left the club. Club deleted as no members remained.' }, { status: 200 });
    }
    await club.save();

    return NextResponse.json({ message: 'Left the club successfully' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
