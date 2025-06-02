import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/connectDB';
import Club from '../../../models/Club';

export async function GET(request, { params }) {
  const { clubId } = params;

  try {
    await connectDB();
    const club = await Club.findById(clubId).populate('members');

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: club.name,
      members: club.members.length,
      imageUrl: club.imageUrl || null
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
