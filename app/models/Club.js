import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // optional - unique club names
    trim: true,
  },
  imageUrl: {
    type: String,
    default: "/default-club.png", // path to a default image if none is provided
  },
  description: {
    type: String,
    required: true,
  },
  weekendCallsEnabled: {
    type: Boolean,
    default: false,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: { type: String,
    
required: true }, // ✅ Add this line

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Club || mongoose.model("Club", ClubSchema);
