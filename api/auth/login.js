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
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    const validPassword = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !validPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return handleApiError(res, error);
  }
};
