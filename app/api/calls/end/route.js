import Call from '@/app/models/Call';
import { authMiddleware } from '@/app/lib/authMiddleware';

export async function POST(req) {
  try {
    const user = await authMiddleware(req);
    const { clubId } = await req.json();

    if (!user.isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin only' }), { status: 403 });
    }

    const call = await Call.findOne({ clubId, isActive: true });
    if (!call) {
      return new Response(JSON.stringify({ error: 'No active call to end' }), { status: 404 });
    }

    call.isActive = false;
    call.endedAt = new Date();
    await call.save();

    return new Response(JSON.stringify({ message: 'Call ended' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
