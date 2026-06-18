/**
 * Database Connection Module
 * Handles MongoDB connection using Mongoose
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined. Please check your .env.local file.');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    console.log('📦 Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔗 Starting new MongoDB connection...');
    console.log('URI (masked):', MONGODB_URI.replace(/:[^:@]*@/, ':****@'));

    // Simplified connection options
    const opts = {
      bufferCommands: false,
      retryWrites: true,
      w: 'majority' as const,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error: any) => {
        console.error('❌ MongoDB connection failed');
        console.error('Error Type:', error?.name);
        console.error('Error Message:', error?.message);
        
        // Provide helpful diagnostics
        if (error?.message?.includes('ENOTFOUND')) {
          console.error('⚠️  DNS resolution failed - Check MongoDB URI cluster name');
        } else if (error?.message?.includes('authentication')) {
          console.error('⚠️  Authentication failed - Check username/password');
        } else if (error?.message?.includes('IP')) {
          console.error('⚠️  IP whitelist issue - Add 0.0.0.0/0 in MongoDB Atlas Network Access');
        }
        
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
