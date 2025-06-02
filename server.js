import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Messege from "./app/models/Messege.js"; // Keep as Messege
import Club from "./app/models/Club.js";
import User from "./app/models/User.js";
import Book from "./app/models/Book.js";
import Discussion from "./app/models/Discussion.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // TODO: restrict in production
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

// Middleware for socket authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

// Socket event handlers
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.id}`);

  // Join club
  socket.on("joinClub", async (clubId) => {
    const club = await Club.findById(clubId);
    if (!club) return socket.emit("error", "Club not found");

    if (
      !club.members.includes(socket.user.id) &&
      club.adminId.toString() !== socket.user.id
    ) {
      return socket.emit("error", "Not a member of this club");
    }

    socket.join(clubId);
    socket.emit("joinedClub", clubId);
    console.log("User joined club:", clubId);
  });


  socket.on("send_message", async (data) => {
    console.log("Received message:", data);

    // data should contain: { clubId, userId, text, bookReference?, replyTo? }
    try {
      // 1. Save the new message
      const newMessage = new Messege({
        clubId: data.clubId,
        userId: data.userId,
        text: data.text,
        bookReference: data.bookReference || null,
        replyTo: data.replyTo || null,
      });
      console.log("Attempting to save message:", newMessage);

      await newMessage.save();
      const populatedMessage = await newMessage.populate(
        "userId",
        "name avatar"
      );
      io.to(data.clubId.toString()).emit("newMessage", populatedMessage);
      // 2. Update the club discussion document
      let discussion = await Discussion.findOne({ clubId: data.clubId });
      if (!discussion) {
        discussion = new Discussion({ clubId: data.clubId, messages: [] });
      }
      discussion.messages.push(newMessage._id);
      await discussion.save();

      // 3. Broadcast the message to other clients in the same club room
      io.to(data.clubId.toString()).emit("newMessege", newMessage);

      // Optional: acknowledge back to sender with saved message
      socket.emit("message_saved", newMessage);
      console.log("Message saved:", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error_message", { error: "Failed to save message." });
    }
  });

  // Edit message
  socket.on("editMessege", async ({ messegeId, newText }) => {
    try {
      const messege = await Messege.findById(messegeId);
      if (!messege) return socket.emit("error", "Message not found");

      const club = await Club.findById(messege.clubId);
      if (!club) return socket.emit("error", "Club not found");

      if (messege.userId.toString() !== socket.user.id) {
        return socket.emit("error", "Unauthorized to edit message");
      }

      messege.text = newText;
      messege.edited = true;
      messege.updatedAt = new Date();
      await messege.save();
      await messege.populate([
        { path: "userId", select: "name email" },
        { path: "bookReference", select: "title" },
      ]);

      io.to(club.id).emit("messegeEdited", messege);
    } catch (err) {
      console.error("Editing message failed:", err);
      socket.emit("error", "Editing message failed");
    }
  });

  // Delete message
  socket.on("deleteMessege", async ({ messegeId }) => {
    try {
      const messege = await Messege.findById(messegeId);
      if (!messege) return socket.emit("error", "Message not found");

      const club = await Club.findById(messege.clubId);
      if (!club) return socket.emit("error", "Club not found");

      if (
        messege.userId.toString() !== socket.user.id &&
        club.adminId.toString() !== socket.user.id
      ) {
        return socket.emit("error", "Unauthorized to delete message");
      }

      await Messege.deleteOne({ _id: messegeId });
      io.to(club.id).emit("messegeDeleted", { messegeId });
    } catch (err) {
      console.error("Deleting message failed:", err);
      socket.emit("error", "Deleting message failed");
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
});

const PORT = process.env.SOCKET_PORT || 4000;
server.listen(PORT, () =>
  console.log(`Socket.IO server running on port ${PORT}`)
);
