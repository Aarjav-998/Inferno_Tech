const { handleApiError, sendMethodNotAllowed } = require("../../lib/api");
const { connectDB, isValidObjectId } = require("../../lib/db");
const { Message } = require("../../lib/models");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    await connectDB();
    const { name, email, message, userId } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    if (userId && !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const newMessage = await Message.create({
      name,
      email,
      message,
      user: userId || null
    });

    return res.status(201).json({ message: "Message created.", data: newMessage });
  } catch (error) {
    return handleApiError(res, error);
  }
};
