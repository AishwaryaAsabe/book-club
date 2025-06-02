import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
 participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  currentlyOnline: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: false },
  scheduledStart: { type: Date, default: null },
  scheduledEnd: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
 
  endedAt: { type: Date, default: null }
});

export default mongoose.models.Call || mongoose.model('Call', callSchema);
