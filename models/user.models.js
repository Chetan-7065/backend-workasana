import mongoose from "mongoose";
import { setThePassword } from "whatwg-url";
import { union } from "zod";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
 name: { type: String, required: true }, 
 email: { type: String, required: true, unique: true },
 password: {type: String, required: true}
});

userSchema.pre("save", async function (next){
  const user = this
  if(!user.isModified("password")){
    return next()
  }
  try{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)
    user.password = hashedPassword
  }catch(error){
    next(error)
  }
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User