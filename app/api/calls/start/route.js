import Call from '@/app/models/Call';
import { authMiddleware } from '@/app/lib/authMiddleware';
import Club from '@/app/models/Club';

export async function POST(req) {
  try {
    const user = await authMiddleware(req);
    const { clubId } = await req.json();
    const club = await Club.findById(clubId);
 console.log('starting call for club:',clubId,'by user:',user._id);

   if (!club || String(club.adminId) !== String(user._id)) {
  return new Response(JSON.stringify({ error: 'Admin only' }), { status: 403 });
}

    // End any other active call for the same club
    await Call.updateMany({ clubId, isActive: true }, { isActive: false, endedAt: new Date() });

    const call = await Call.create({
      clubId,
      isActive: true,
      startedAt: new Date(),
      participants: [],
      currentlyOnline: [],
    });

    return new Response(JSON.stringify(call), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
