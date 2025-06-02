// app/api/books/search/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/connectDB';
import Book from '../../../models/Book';
import { authMiddleware } from '../../../lib/authMiddleware';

export async function GET(req) {
  await connectDB();
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const clubId = searchParams.get('clubId');
  const query = searchParams.get('q') || '';

  if (!clubId) return NextResponse.json({ error: 'clubId required' }, { status: 400 });

  const books = await Book.find({
    clubId,
    title: { $regex: query, $options: 'i' },
  }).limit(10);

  return NextResponse.json({ books });
}
