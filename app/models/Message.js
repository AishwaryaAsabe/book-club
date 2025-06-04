import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  bookReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', default: null }, 
  edited: { type: Boolean, default: false },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Messege', default: null },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
