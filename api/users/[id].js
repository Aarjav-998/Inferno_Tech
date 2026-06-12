const { handleApiError, sendMethodNotAllowed } = require("../../lib/api");
const { getAuth } = require("../../lib/auth");
const { connectDB, isValidObjectId } = require("../../lib/db");
const { Message, User, publicUser } = require("../../lib/models");

module.exports = async function handler(req, res) {
  if (!["GET", "PATCH", "DELETE"].includes(req.method)) {
    return sendMethodNotAllowed(res, ["GET", "PATCH", "DELETE"]);
  }

  try {
    await connectDB();
    const auth = getAuth(req);
    const { id } = req.query;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (req.method === "GET") {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json({ user: publicUser(user) });
    }

    if (auth.id !== id) {
      return res.status(403).json({ message: "You can only modify your own account." });
    }

    if (req.method === "PATCH") {
      const updates = {};
      ["name", "bio", "gender"].forEach((field) => {
        if (req.body?.[field] !== undefined) updates[field] = req.body[field];
      });

      const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json({ user: publicUser(user) });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Message.deleteMany({ user: id });
    return res.status(200).json({ message: "Account deleted." });
  } catch (error) {
    return handleApiError(res, error);
  }
};
