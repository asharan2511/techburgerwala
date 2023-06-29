import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  photo: String,
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", UserSchema);
