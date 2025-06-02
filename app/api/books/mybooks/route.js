
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/connectDB';
import userBook from '../../../models/UserBook';
import { authMiddleware } from '../../../lib/authMiddleware';

export async function POST(req) {
  try {
    await connectDB();
    
    const user = await authMiddleware(); // Assumes this returns { _id, name, ... }
    const userId = user._id;

    const body = await req.json();
    const {
      bookId,
      title,
      author,
      description,
      thumbnail,
      link,
      genre,
      averageRating,
      totalRatings
    } = body;

    // Optional: Prevent duplicate entries for the same user + book
    const existing = await userBook.findOne({ user: userId, bookId });
    if (existing) {
      return NextResponse.json({ message: 'Book already in your list.' }, { status: 400 });
    }

    const newBook = await userBook.create({
      user: userId,
      bookId,
      title,
      author,
      description,
      thumbnail,
      link,
      genre,
      averageRating,
      totalRatings,
      status: 'currentlyReading'
    });

    return NextResponse.json({ message: 'Book added to currently reading.', book: newBook }, { status: 201 });

  } catch (error) {
    console.error('Error adding book to currently reading:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}




export async function GET() {
  try {
    await connectDB();

    const user = await authMiddleware();
    const userId = user._id;

    const books = await userBook.find({ user: userId, status: 'currentlyReading' }).sort({ updatedAt: -1 });

    return NextResponse.json({ recentBooks: books }, { status: 200 });
  } catch (error) {
    console.error('Error fetching currently reading books:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
