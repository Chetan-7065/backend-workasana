import "dotenv/config"
import mongoose from "mongoose"

const mongoUri = process.env.MONGODB

export function initializeDatabase(){
  mongoose.connect(mongoUri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000, 
    retryWrites: true,    
    retryReads: true
  }).then(() => console.log("Connected Successfully") ).catch((error) => console.log("Error while connecting the database" , error))
}

