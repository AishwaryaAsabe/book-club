// app/api/clubs/top6/route.js

import Club from '../../../models/Club';
import { NextResponse } from 'next/server'
import { connectDB } from '../../../lib/connectDB'

export async function GET() {
  try {
    await connectDB(); // ensure DB connection

    const clubs = await Club.aggregate([
      {
        $addFields: { membersCount: { $size: "$members" } }
      },
      {
        $sort: { membersCount: -1 }
      },
      {
        $limit: 6
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          createdAt: 1,
          imageUrl: 1,
          membersCount: 1
        }
      }
    ])

    return NextResponse.json(clubs, { status: 200 })
  } catch (error) {
    console.error('Error fetching top clubs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
