const { handleApiError, sendMethodNotAllowed } = require("../lib/api");
const { getAuth } = require("../lib/auth");
const { connectDB, isValidObjectId } = require("../lib/db");
const { User, publicUser } = require("../lib/models");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    await connectDB();
    const auth = getAuth(req);

    if (!isValidObjectId(auth.id)) {
      return res.status(401).json({ message: "Invalid session. Please log in again." });
    }

    const user = await User.findByIdAndUpdate(
      auth.id,
      { waitlistJoinedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Successfully added to the waitlist.",
      user: publicUser(user)
    });
  } catch (error) {
    return handleApiError(res, error);
  }
};
