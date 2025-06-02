import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';    
import { startWeekendCalls } from './app/cron/route.js';

const MONGO_URI = process.env.MONGODB_URI;

async function runTest() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected.');

    await startWeekendCalls(); // Manually trigger weekend call logic

    console.log('✅ Weekend calls triggered.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
