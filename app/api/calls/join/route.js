import Call from '../../../models/Call';
import { authMiddleware } from '../../../lib/authMiddleware';

export async function POST(req) {
  try {
    const user = await authMiddleware(req);
    const body = await req.json();
    const { clubId } = body;

    const call = await Call.findOne({ clubId, isActive: true });
    if (!call) {
      return new Response(JSON.stringify({ error: 'No active call' }), { status: 404 });
    }

    // Add to participants if not already
    if (!call.participants.includes(user._id)) {
      call.participants.push(user._id);
    }

    // Add to currentlyOnline if not already
    if (!call.currentlyOnline.includes(user._id)) {
      call.currentlyOnline.push(user._id);
    }

    await call.save();

    return new Response(JSON.stringify({ message: 'Joined call' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
