const { handleApiError, sendMethodNotAllowed } = require("../../lib/api");
const { connectDB } = require("../../lib/db");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return sendMethodNotAllowed(res, ["GET"]);
  }

  try {
    await connectDB();
    return res.status(200).json({
      ok: true,
      message: "MongoDB connection is working.",
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      hasJwtSecret: Boolean(process.env.JWT_SECRET)
    });
  } catch (error) {
    return handleApiError(res, error);
  }
};
