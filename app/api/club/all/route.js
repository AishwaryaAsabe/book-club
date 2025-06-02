import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/connectDB';
import Club from '../../../models/Club';

export async function GET() {
  try {
    await connectDB();

  const clubs = await Club.find({}, 'name description adminId members books createdAt')
  .populate('adminId', 'name');  // populate adminId but only fetch the 'name' field of the User


    const filteredClubs = clubs.map(club => ({
      _id: club._id,
      name: club.name,
      description: club.description,
      admin: club.adminId,
      membersCount: club.members.length,
      booksCount: club.books.length,
      createdAt: club.createdAt,
    }));

    return NextResponse.json(filteredClubs, { status: 200 });

  } catch (error) {
    console.error('Error fetching all clubs:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


