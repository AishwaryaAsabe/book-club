import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import startWeekendCalls from './cron/startWeekendCalls.js'
import cron from 'node-cron';

// Load environment variables
dotenv.config();

// Import models
import Call from './app/models/Call.js';
import Club from './app/models/Club.js';
import User from './app/models/User.js';

// Setup Express and HTTP server
const app = express();
const server = http.createServer(app);

// Setup Socket.IO server
export const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Auth middleware for socket connections
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Unauthorized'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Unauthorized'));
  }
});

// On new socket connection
io.on('connection', (socket) => {
  console.log(`🔗 User connected: ${socket.user.id}`);

  joinUserToClubs(socket);

  socket.on('joinCall', async ({ callId }) => {
    try {
      const call = await Call.findById(callId);
      if (!call || !call.isActive) {
        return socket.emit('error', 'Call not active or found');
      }

      const club = await Club.findById(call.clubId);
      if (!club) {
        return socket.emit('error', 'Club not found');
      }

      const isMember = club.members.some(m => m.toString() === socket.user.id);
      const isAdmin = club.adminId.toString() === socket.user.id;

      if (!isMember && !isAdmin) {
        return socket.emit('error', 'Not authorized to join this call');
      }

      socket.join(callId);

      if (!call.participants.includes(socket.user.id)) {
        call.participants.push(socket.user.id);
        await call.save();
      }

      io.to(callId).emit('participantJoined', { userId: socket.user.id });
      socket.emit('joinedCall', callId);
    } catch (err) {
      console.error('Error in joinCall:', err);
      socket.emit('error', 'Internal server error');
    }
  });

  socket.on('leaveCall', async ({ callId }) => {
    try {
      const call = await Call.findById(callId);
      if (!call) return;

      call.participants = call.participants.filter(
        id => id.toString() !== socket.user.id
      );
      await call.save();

      socket.leave(callId);
      io.to(callId).emit('participantLeft', { userId: socket.user.id });
    } catch (err) {
      console.error('Error in leaveCall:', err);
    }
  });

  socket.on('endCall', async ({ callId }) => {
    try {
      const call = await Call.findById(callId);
      if (!call) return;

      const club = await Club.findById(call.clubId);
      if (!club) {
        return socket.emit('error', 'Club not found');
      }
      if (club.adminId.toString() !== socket.user.id) {
        return socket.emit('error', 'Only admin can end the call');
      }

      call.isActive = false;
      call.endedAt = new Date();
      await call.save();

      io.to(callId).emit('callEnded');
      io.in(callId).socketsLeave(callId);
    } catch (err) {
      console.error('Error in endCall:', err);
      socket.emit('error', 'Internal server error');
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.user.id}`);
  });
});

// Helper function to join user to their club rooms
async function joinUserToClubs(socket) {
  try {
    const user = await User.findById(socket.user.id);
    if (!user) return;

    const clubs = await Club.find({
      $or: [
        { adminId: user._id },
        { members: user._id },
      ]
    });

    clubs.forEach(club => {
      socket.join(`club_${club._id}`);
    });
  } catch (err) {
    console.error('Error joining club rooms:', err);
  }
}

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv[1] === __filename) {
  const PORT = process.env.SOCKET_PORT || 4000;
  const MONGODB_URI = process.env.MONGODB_URI;

  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB connected.');

      server.listen(PORT, () => {
        console.log(`🚀 Socket server running on port ${PORT}`);

        // Schedule weekend calls check every hour with error handling
        cron.schedule('0 * * * *', async () => {
          console.log('[Cron] Checking for weekend calls...');
          try {
            await startWeekendCalls();
          } catch (err) {
            console.error('[Cron] Error in weekend calls:', err);
          }
        });
      });
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}
