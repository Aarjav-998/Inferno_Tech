const bcrypt = require("bcryptjs");
const { handleApiError, sendMethodNotAllowed } = require("../../lib/api");
const { createToken } = require("../../lib/auth");
const { connectDB } = require("../../lib/db");
const { User, publicUser } = require("../../lib/models");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res, ["POST"]);
  }

  try {
    await connectDB();
    const { name, email, password, bio = "", gender = "" } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, bio, gender });

    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return handleApiError(res, error);
  }
};
