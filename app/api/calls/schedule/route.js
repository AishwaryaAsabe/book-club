import Call from '../../../models/Call';
import { authMiddleware } from '../../../lib/authMiddleware';

export async function POST(req) {
  try {
    const user = await authMiddleware(req);
    const { clubId, scheduledStart, scheduledEnd } = await req.json();

    if (!user.isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin only' }), { status: 403 });
    }

    const call = await Call.create({
      clubId,
      scheduledStart: new Date(scheduledStart),
      scheduledEnd: new Date(scheduledEnd),
      isActive: false,
      participants: [],
      currentlyOnline: [],
    });

    return new Response(JSON.stringify(call), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
