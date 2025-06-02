// app/api/books/[clubId]/add/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/connectDB';
import Club from '../../../../models/Club';
import Book from '../../../../models/Book';
import { authMiddleware } from '../../../../lib/authMiddleware';

export async function POST(req, { params }) {
  await connectDB();
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { clubId } = params;
  const { title, description, resourceLink } = await req.json();

  try {
    const club = await Club.findById(clubId);
    if (!club) return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    if (!club.members.includes(user.id)) {
      return NextResponse.json({ error: 'You must be a member to add books' }, { status: 403 });
    }

    const newBook = await Book.create({
      title,
      description,
      resourceLink,
      addedBy: user.id,
      clubId: clubId
    });

    club.books.push(newBook._id);
    await club.save();

    return NextResponse.json({ message: 'Book added', book: newBook }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
