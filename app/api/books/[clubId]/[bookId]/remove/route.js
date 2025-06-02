// app/api/books/[clubId]/remove/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/connectDB';
import Club from '@/app/models/Club';
import Book from '@/app/models/Book';
import { authMiddleware } from '@/app/lib/authMiddleware';

export async function POST(req, { params }) {
  await connectDB();
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const { clubId, bookId } = params;


  try {
    const club = await Club.findById(clubId);
    const book = await Book.findById(bookId);
    if (!club || !book) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isAdmin = club.adminId.toString() === user.id;
    const isOwner = book.addedBy.toString() === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Remove from Club's book list
    club.books = club.books.filter(id => id.toString() !== bookId);
    await club.save();

    // Delete book from DB
    await book.deleteOne();

    return NextResponse.json({ message: 'Book removed' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
