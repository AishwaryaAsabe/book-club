import { NextResponse } from 'next/server';
import Club from '../../../../models/Club';
import { connectDB } from '../../../../lib/connectDB';
import { authMiddleware } from '../../../../lib/authMiddleware';

export async function POST(req, { params }) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { clubId } = params;
  const { userId: removeUserId } = await req.json();

  const club = await Club.findById(clubId);
  if (!club) return NextResponse.json({ error: 'Club not found' }, { status: 404 });

  if (club.adminId.toString() !== user.id) {
    return NextResponse.json({ error: 'Only admin can remove members' }, { status: 403 });
  }

  if (removeUserId === club.adminId.toString()) {
    return NextResponse.json({ error: 'Admin cannot be removed' }, { status: 400 });
  }

  if (!club.members.includes(removeUserId)) {
    return NextResponse.json({ error: 'User is not a member' }, { status: 400 });
  }

  club.members = club.members.filter((id) => id.toString() !== removeUserId);
  await club.save();

  return NextResponse.json({ message: 'Member removed successfully' }, { status: 200 });
}
