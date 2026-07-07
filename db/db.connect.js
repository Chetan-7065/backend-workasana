import "dotenv/config"
import mongoose from "mongoose"

const mongoUri = process.env.MONGODB

if (!mongoUri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let isConnected = false;

export async function initializeDatabase(){
  if(isConnected) return
  if (isConnected) return;

  try {
    const db = await mongoose.connect(mongoUri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000, 
    retryWrites: true,    
    retryReads: true,
    bufferCommands: false
  });
    isConnected = db.connections[0].readyState === 1; 
    console.log(" New MongoDB connection established");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; 
  }
}

