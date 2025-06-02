import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  bio: { type: String, default: '' },           // Optional bio field
  avatarUrl: { type: String, default: '' },
  books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userBook",
      },
    ],// Will store hashed password
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
