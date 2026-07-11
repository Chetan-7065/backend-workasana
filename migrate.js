import "dotenv/config";
import mongoose from "mongoose";
import Task from "./models/task.models.js";

const mongoUri = process.env.MONGODB

async function updateTaskSchema(){
  await mongoose.connect(mongoUri)
  console.log("connected Successfully")

  try{
    const updatedTask = await Task.updateMany(
      {dueDate: {$exists: false}},
      {$set : {dueDate: new Date()}}
    )
    if(updatedTask.modifiedCount > 0){
      console.log(`Total task updated: ${updatedTask.modifiedCount}`)
    }else{
      console.log("No tasks found missing a dueDate.")
    }
  }catch(error){
    console.error("An error occured",error)
  }
  finally{
   await mongoose.disconnect()
   console.log("Disconnected successfully")
    process.exit(0)
  }
}

updateTaskSchema()

export default updateTaskSchema