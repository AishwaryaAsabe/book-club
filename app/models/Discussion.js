import mongoose from 'mongoose';

const DiscussionSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', unique: true, required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Messege' }],  // array of message IDs
}, { timestamps: true });

export default mongoose.models.Discussion || mongoose.model('Discussion', DiscussionSchema);
