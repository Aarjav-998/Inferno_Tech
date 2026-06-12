const { handleApiError, sendMethodNotAllowed } = require("../../lib/api");
const { getAuth } = require("../../lib/auth");
const { connectDB, isValidObjectId } = require("../../lib/db");
const { User, publicUser } = require("../../lib/models");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return sendMethodNotAllowed(res, ["GET"]);
  }

  try {
    await connectDB();
    const auth = getAuth(req);

    if (!isValidObjectId(auth.id)) {
      return res.status(401).json({ message: "Invalid session. Please log in again." });
    }

    const user = await User.findById(auth.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    return handleApiError(res, error);
  }
};
