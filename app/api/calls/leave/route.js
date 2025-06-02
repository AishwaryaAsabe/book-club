import Call from '../../../models/Call';
import { authMiddleware } from '../../../lib/authMiddleware';

export async function POST(req) {
  try {
    const user = await authMiddleware(req);
    const { clubId } = await req.json();

    const call = await Call.findOne({ clubId, isActive: true });
    if (!call) {
      return new Response(JSON.stringify({ error: 'No active call to leave' }), { status: 404 });
    }

    call.currentlyOnline = call.currentlyOnline.filter(
      (id) => id.toString() !== user._id.toString()
    );

    await call.save();

    return new Response(JSON.stringify({ message: 'Left call' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
