// app/api/clubs/[clubId]/delete/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/connectDB';
import Club from '../../../../models/Club';
import { authMiddleware } from '../../../../lib/authMiddleware';

export async function DELETE(req, { params }) {
  await connectDB();
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { clubId } = params;

  try {
    const club = await Club.findById(clubId);
    if (!club) return NextResponse.json({ error: 'Club not found' }, { status: 404 });

    if (club.adminId.toString() !== user.id) {
      return NextResponse.json({ error: 'Only admin can delete the club' }, { status: 403 });
    }

    await Club.findByIdAndDelete(clubId);

    return NextResponse.json({ message: 'Club deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
