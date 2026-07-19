import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
});
const Team = mongoose.model("Team", teamSchema);

export default Team;
