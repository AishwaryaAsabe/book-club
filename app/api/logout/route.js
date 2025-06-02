// /api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.set('token', '', { maxAge: 0 }); // Clear cookie
  return response;
}
