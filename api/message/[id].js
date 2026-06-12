const { handleApiError, sendMethodNotAllowed } = require("../../lib/api");
const { connectDB, isValidObjectId } = require("../../lib/db");
const { Message } = require("../../lib/models");

module.exports = async function handler(req, res) {
  if (!["GET", "DELETE"].includes(req.method)) {
    return sendMethodNotAllowed(res, ["GET", "DELETE"]);
  }

  try {
    await connectDB();
    const { id } = req.query;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: req.method === "GET" ? "Invalid user ID." : "Invalid message ID."
      });
    }

    if (req.method === "GET") {
      const messages = await Message.find({ user: id }).sort({ createdAt: -1 });
      return res.status(200).json({ messages });
    }

    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found." });
    }

    return res.status(200).json({ message: "Message deleted." });
  } catch (error) {
    return handleApiError(res, error);
  }
};
