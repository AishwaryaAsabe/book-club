// app/api/books/[clubId]/all/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/connectDB';
import Book from '@/app/models/Book';

export async function GET(req, { params }) {
  await connectDB();
  const { clubId } = params;

  try {
    const books = await Book.find({ clubId });
    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
