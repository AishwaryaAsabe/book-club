import { connectDB } from '../../../lib/connectDB';
import Discussion from '../../../models/Discussion';
import Message from '../../../models/Message';

export async function GET(req, { params }) {
  await connectDB();
  const { clubId } = await params; // ✅ This is REQUIRED in app directory

  if (!clubId.match(/^[0-9a-fA-F]{24}$/)) {
    return new Response(JSON.stringify({ error: 'Invalid clubId' }), { status: 400 });
  }

  try {
    const discussion = await Discussion.findOne({ clubId })
      .populate({
        path: 'messages',
        populate: { path: 'userId', select: 'name avatar' }
      });

    if (!discussion) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    return new Response(JSON.stringify(discussion.messages), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function POST(req, { params }) {
  await connectDB();
  const { clubId } = params;

  if (!clubId.match(/^[0-9a-fA-F]{24}$/)) {
    return new Response(JSON.stringify({ error: 'Invalid clubId' }), { status: 400 });
  }

  try {
    const body = await req.json();
    const { userId, text, bookReference, replyTo } = body;

    if (!userId || !text) {
      return new Response(JSON.stringify({ error: 'userId and text are required' }), { status: 400 });
    }

    // 1. Create the message
    const newMsg = await Message.create({
      clubId,
      userId,
      text,
      bookReference: bookReference || null,
      replyTo: replyTo || null,
    });

    // 2. Find or create the discussion
    let discussion = await Discussion.findOne({ clubId });
    if (!discussion) {
      discussion = await Discussion.create({ clubId, messages: [] });
    }

    // 3. Push the message ID
    discussion.messages.push(newMsg._id);
    await discussion.save();

    // 4. Populate userId for response
    await newMsg.populate({ path: 'userId', select: 'name avatar' });

    return new Response(JSON.stringify(newMsg), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
