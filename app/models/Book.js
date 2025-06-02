import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  resourceLink: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  category: String
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model('Book', bookSchema);
