const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: "", trim: true },
    gender: { type: String, default: "", trim: true },
    waitlistJoinedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["new", "read", "archived"], default: "new" }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    gender: user.gender,
    waitlistJoinedAt: user.waitlistJoinedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

module.exports = {
  Message,
  User,
  publicUser
};
