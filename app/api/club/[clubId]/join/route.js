import { NextResponse } from 'next/server';
import Club from '../../../../models/Club';
import { connectDB } from '../../../../lib/connectDB';
import { authMiddleware } from '../../../../lib/authMiddleware';

export async function POST(req, { params }) {
  await connectDB();
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  params = await params;
  const { clubId } = params;

  const result = await Club.updateOne(
    { _id: clubId },
    { $addToSet: { members: user.id } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Club not found' }, { status: 404 });
  }

  if (result.modifiedCount === 0) {
    return NextResponse.json({ error: 'Already a member' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Joined club successfully' }, { status: 200 });
}
