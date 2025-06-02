import mongoose from 'mongoose';

const userBookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookId: {
      type: String, // Google Books API ID
      required: true
    },
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: 'Unknown'
    },
    description: {
      type: String
    },
    thumbnail: {
      type: String
    },
    link: {
      type: String
    },
    genre: {
      type: [String],
      default: []
    },
    averageRating: {
      type: Number
    },
    totalRatings: {
      type: Number
    },
    status: {
      type: String,
      enum: ['currentlyReading', 'completed', 'wishlist'],
      default: 'currentlyReading'
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserBook || mongoose.model('UserBook', userBookSchema);
