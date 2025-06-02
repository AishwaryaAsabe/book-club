import { connectDB } from '../../../../lib/connectDB';
import Club from '../../../../models/Club';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  const { clubId } = context.params;

  if (!clubId) {
    return NextResponse.json({ error: 'clubId is required' }, { status: 400 });
  }

  try {
    await connectDB();

    const club = await Club.findById(clubId)
      .populate('members', 'name avatarUrl')
      .lean();

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    const membersWithStatus = club.members.map((member) => ({
      _id: member._id,
      name: member.name,
      avatar: member.avatarUrl || '/default-avatar.png',
      status: 'online',
    }));

    return NextResponse.json({ members: membersWithStatus }, { status: 200 });
  } catch (error) {
    console.error('💥 API Server Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
