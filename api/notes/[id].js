const { handleApiError, sendMethodNotAllowed } = require("../../lib/api");
const { connectDB, isValidObjectId } = require("../../lib/db");
const { Message } = require("../../lib/models");

module.exports = async function handler(req, res) {
  if (req.method !== "PATCH") {
    return sendMethodNotAllowed(res, ["PATCH"]);
  }

  try {
    await connectDB();
    const { id } = req.query;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid message ID." });
    }

    const updates = {};
    ["name", "email", "message", "status"].forEach((field) => {
      if (req.body?.[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedMessage = await Message.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found." });
    }

    return res.status(200).json({ message: "Message updated.", data: updatedMessage });
  } catch (error) {
    return handleApiError(res, error);
  }
};
