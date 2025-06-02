import Call from "@/app/models/Call";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get('clubId');

    const call = await Call.findOne({ clubId, isActive: true })
      .populate('participants', 'name avatarUrl')
      .populate('currentlyOnline', 'name avatarUrl');

    if (!call) {
      return new Response(JSON.stringify({ error: 'No active call' }), { status: 404 });
    }

    return new Response(JSON.stringify(call), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
