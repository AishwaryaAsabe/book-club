import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/connectDB';
import Messege from '../../../models/Messege';

export async function GET(req, { params }) {
  const { clubId } = params;

  if (!clubId) {
    return NextResponse.json({ success: false, message: 'Club ID is required' }, { status: 400 });
  }

  try {
    await connectDB();

    // Fetch messages for the club, sorted by creation date ascending (oldest first)
    const messages = await Messege.find({ clubId })
      .populate('userId', 'name avatarUrl') // get user name, avatar (optional)
      .populate('bookReference', 'title author') // book info if referenced
      .sort({ createdAt: 1 });

    return NextResponse.json({ success: true, messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch messages' }, { status: 500 });
  }
}
