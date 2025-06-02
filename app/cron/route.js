import mongoose from 'mongoose';
import Call from '../models/Call.js';
import Club from '../models/Club.js';
import { io } from '../../socket-server.js';

export async function startWeekendCalls() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();

  // Run only on Saturday or Sunday at 19:00 (7 PM)
  if ((day === 6 || day === 0) && hour === 19) {
    try {
      const clubs = await Club.find({ weekendCallsEnabled: true });

      for (const club of clubs) {
        // End any active calls for this club
        await Call.updateMany(
          { clubId: club._id, isActive: true },
          { isActive: false, endedAt: new Date() }
        );

        // Create new weekend call
        const newCall = await Call.create({
          clubId: club._id,
          isActive: true,
          startedAt: now,
          scheduledEnd: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour later
          participants: [],
          autoStarted: true,
        });

        // Notify clients in the club room about the new weekend call
        io.to(`club_${club._id}`).emit('newWeekendCall', {
          callId: newCall._id,
          message: `A new weekend call has started in ${club.name}!`,
        });
      }

      console.log(`[WeekendCalls] Started calls for ${clubs.length} clubs.`);
    } catch (err) {
      console.error('[WeekendCalls] Error:', err);
    }
  }
}
